import openai
import wave
import contextlib
import io
import requests

from core.models import UserModel, ProfileModel
from ai.utils.ai_manager import BaseAIManager

class OpenAIManager(BaseAIManager):
    def __init__(self, model, api_key, cur_users=[], max_chars_per_message=4000, max_total_chars_for_messages=16000):
        """
        Initialize the OpenAIManager.
        
        Args:
            model (str): The OpenAI model name (e.g., 'gpt-4o', 'gpt-3.5-turbo').
            api_key (str): Your OpenAI API key.
        
        Returns:
            None
        
        Example:
            manager = OpenAIManager(model="gpt-4o", api_key="sk-...")
        """
        super().__init__(ai_type="open_ai", cur_users=cur_users)
        self.OPENAI_PRICING = {
            "gpt-3.5-turbo": {
                "input_per_1k_token": 0.0005,
                "output_per_1k_token": 0.0015,
            },
            "gpt-4-turbo": {
                "input_per_1k_token": 0.01,
                "output_per_1k_token": 0.03,
                "image_per_1_image": 0.00765,
            },
            "gpt-4o": {
                "input_per_1k_token": 0.005,
                "output_per_1k_token": 0.015,
                "audio_stt_per_1_minute": 0.006,
                "image_per_1_image": 0.04,
                "tts_standard_per_1k_char": 0.015,
                "tts_premium_per_1k_char": 0.030,
            },
            "gpt-4": {
                "input_per_1k_token": 0.03,
                "output_per_1k_token": 0.06,
            },
            "text-embedding-3-small": {
                "input_per_1k_token": 0.00002,
            },
            "text-embedding-3-large": {
                "input_per_1k_token": 0.00013,
            },
            "whisper": {
                "audio_stt_per_1_minute": 0.006,
            },
        }
        self.OPEN_AI_CLIENT = openai.OpenAI(api_key=api_key)
        self.model = model
        self.max_chars_per_message = max_chars_per_message
        self.max_total_chars_for_messages = max_total_chars_for_messages
    
    def _get_len_of_non_system_msgs(self):
        old_non_system_msgs = [msg for msg in self.messages if msg["role"] != "system"]
        total_chars = 0
        for msg in old_non_system_msgs:
            msg_content = msg.get("content", "")
            if isinstance(msg_content, str):
                total_chars += len(msg_content)
            elif isinstance(msg_content, list):
                for item in msg_content:
                    if item.get("type") == "text":
                        total_chars += len(item.get("text", ""))
        return total_chars
    
    def add_message(self, role, text=None, img_url=None):
        """
        Add a message to the conversation history. Supports multimodal (text + image) messages.
        
        Args:
            role (str): One of 'system', 'user', 'assistant'.
            text (str): The text content.
            img_url (str): The image URL (optional).
        
        Returns:
            None
        
        Example:
            manager.add_message("user", text="Describe this image.", img_url="https://example.com/image.png")
            manager.add_message("user", text="Hello!")
        """
        if role not in ["system", "user", "assistant"]:
            return
        
        if text is None and img_url is None:
            return
        
        content = []
        if role == "system":
            if text:
                content.append({"type": "text", "text": text})
            if img_url:
                content.append({"type": "image_url", "image_url": {"url": img_url}})
            
            for i, msg in enumerate(self.messages):
                if msg["role"] != "system":
                    break
            try:
                self.messages.insert(i, {"role": "system", "content": content})
            except Exception as e:
                self.messages.insert(0, {"role": "system", "content": content})
        
        else:
            total_char_of_old_non_sys_msgs = self._get_len_of_non_system_msgs()
            if total_char_of_old_non_sys_msgs + (len(text) if text else 0) > self.max_total_chars_for_messages:
                old_non_system_msgs = [msg for msg in self.messages if msg["role"] != "system"]
                old_system_msgs = [msg for msg in self.messages if msg["role"] == "system"]
                accum_txt = ""
                for msg in old_non_system_msgs:
                    msg_content = msg.get("content", "")
                    if isinstance(msg_content, str):
                        accum_txt += msg_content
                    elif isinstance(msg_content, list):
                        for item in msg_content:
                            if item.get("type") == "text":
                                accum_txt += item.get("text", "")
                if accum_txt:
                    original_old_sys_messages = []
                    summary_sys_msg = ""
                    for msg in old_system_msgs:
                        msg_content = msg.get("content", "")
                        if isinstance(msg_content, dict) and msg_content.get("type") == "text":
                            if "Previous conversation summary:" in msg_content.get("text", ""):
                                summary_sys_msg = msg_content.get("text", "")
                            else:
                                original_old_sys_messages.append(msg)
                        else:
                            original_old_sys_messages.append(msg)
                    summary = self.summarize(f"{summary_sys_msg}\n {accum_txt}", max_length=self.max_total_chars_for_messages // 4)
                    self.messages = original_old_sys_messages
                    self.messages.append({"role": "system", "content": {"type": "text", "text": f"**Previous conversation summary:** {summary}"}})
            if text:
                if len(text) > self.max_chars_per_message:
                    text = self.summarize(text, max_length=self.max_chars_per_message)
                content.append({"type": "text", "text": text})
            if img_url:
                content.append({"type": "image_url", "image_url": {"url": img_url}})
            self.messages.append({"role": role, "content": content})

    def generate_response(self, max_token=2000, messages=None, clear_messages=True, **kwargs):
        """
        Generate a response from the OpenAI chat model.
        
        Args:
            max_token (int): Maximum number of tokens in the response. Default is 2000.
            messages (list): List of message dicts. If None, uses internal history.
        
        Returns:
            str: The assistant's response text.
        
        Example:
            reply = manager.generate_response(max_token=500)
        """
        if messages is None:
            messages = self.messages
        response = self.OPEN_AI_CLIENT.chat.completions.create(
            model=self.model,
            messages=messages if messages else self.messages,
            max_tokens=max_token,
            **kwargs
        )
        tokens_used = response.usage
        prompt_tokens = tokens_used.prompt_tokens
        completion_tokens = tokens_used.completion_tokens
        pricing = self.OPENAI_PRICING.get(self.model, {})
        input_price = pricing.get("input_per_1k_token", 0)
        output_price = pricing.get("output_per_1k_token", 0)
        
        cost = (prompt_tokens / 1000) * input_price + (completion_tokens / 1000) * output_price
        self._apply_cost(cost=cost, service="OPEN_AI_COMPLETION")

        raw_response = response.choices[0].message.content.strip() if response.choices and response.choices[0].message else ""
        if clear_messages:
            self.clear_messages()
        return self._clean_code_block(raw_response)

    
    def stt(self, audio_input, response_format="text", language=None, input_type="url"):
        """
        Transcribe speech to text using OpenAI Whisper.
        
        Args:
            audio_input: Audio data (bytes, file path, or URL).
            response_format (str): Output format. Options: 'text', 'json', 'srt', 'verbose_json'. Default 'text'.
            language (str): Language code (e.g., 'en'). Optional.
            input_type (str): Type of input. Options: 'bytes', 'url', 'file'. Default 'url'.
        
        Returns:
            str or dict: Transcription result in the requested format.
        
        Example:
            # Using bytes
            with open('audio.wav', 'rb') as f:
                audio_bytes = f.read()
            text = manager.stt(audio_bytes, input_type='bytes')
            # Using URL
            text = manager.stt('https://example.com/audio.wav', input_type='url')
            # Using file path
            text = manager.stt('/path/to/audio.wav', input_type='file')
        """
        if input_type == "bytes":
            audio_file = io.BytesIO(audio_input)
            audio_file.name = f"{self._random_generator()}.wav"
            file_for_api = audio_file
            try:
                audio_file.seek(0)
                with contextlib.closing(wave.open(audio_file, 'r')) as f:
                    frames = f.getnframes()
                    rate = f.getframerate()
                    duration_seconds = frames / float(rate)
            except Exception:
                duration_seconds = 0
        elif input_type == "url":
            response_url = requests.get(audio_input)
            audio_bytes = response_url.content
            audio_file = io.BytesIO(audio_bytes)
            audio_file.name = f"{self._random_generator()}.wav"
            file_for_api = audio_file
            try:
                audio_file.seek(0)
                with contextlib.closing(wave.open(audio_file, 'r')) as f:
                    frames = f.getnframes()
                    rate = f.getframerate()
                    duration_seconds = frames / float(rate)
            except Exception:
                duration_seconds = 0
        else:
            file_for_api = audio_input
            try:
                with contextlib.closing(wave.open(audio_input, 'r')) as f:
                    frames = f.getnframes()
                    rate = f.getframerate()
                    duration_seconds = frames / float(rate)
            except Exception:
                duration_seconds = 0
        response = self.OPEN_AI_CLIENT.audio.transcriptions.create(
            model="whisper-1",
            file=file_for_api,
            response_format=response_format,
            language=language
        )
        duration_minutes = duration_seconds / 60
        pricing = self.OPENAI_PRICING.get("whisper", {})
        input_price = pricing.get("audio_stt_per_1_minute", 0)
        cost = duration_minutes * input_price
        self._apply_cost(cost=cost, service="OPEN_AI_STT")
        if response_format == "text":
            return response
        elif response_format == "json":
            return response.json["text"]
        elif response_format == "srt":
            return response.srt
        elif response_format == "verbose_json":
            return response.verbose_json
        else:
            return response

    def tts(self, text, voice="nova", audio_format="mp3", model="tts-1"):
        """
        Convert text to speech using OpenAI TTS.
        
        Args:
            text (str): The text to synthesize.
            voice (str): Voice name (e.g., 'en-US-Wavenet-D'). Default is 'en-US-Wavenet-D'.
            audio_format (str): Output format. Options: 'mp3', 'wav', 'ogg'. Default 'mp3'.
            model (str): TTS model. Options: 'tts-1', 'tts-1-hd'. Default 'tts-1'.
        
        Returns:
            bytes: Audio content in the requested format.
        
        Example:
            audio = manager.tts("Hello world!", voice="en-US-Wavenet-D", audio_format="mp3")
            with open("output.mp3", "wb") as f:
                f.write(audio)
        """
        response = self.OPEN_AI_CLIENT.audio.speech.create(
            model=model,
            input=text,
            voice=voice,
            response_format=audio_format
        )
        pricing = self.OPENAI_PRICING.get("gpt-4o", {})
        if model == "tts-1-hd":
            input_price = pricing.get("tts_premium_per_1k_char", 0)
        else:
            input_price = pricing.get("tts_standard_per_1k_char", 0)
        char_count = len(text)
        cost = (char_count / 1000) * input_price
        self._apply_cost(cost=cost, service="OPEN_AI_TTS")
        return response.content

    def generate_image(self, prompt, size="1024x1024"):
        """
        Generate an image from a text prompt using OpenAI's DALL-E model.

        Args:
            prompt (str): The text prompt to generate the image.
            size (str): The size of the generated image. Default is "1024x1024".

        Returns:
            bytes: The generated image in bytes.

        Example:
            image = manager.generate_image("A futuristic cityscape", size="512x512")
            with open("output.png", "wb") as f:
                f.write(image)
        """
        response = self.OPEN_AI_CLIENT.images.generate(
            model="dall-e",
            prompt=prompt,
            size=size
        )
        image_url = response.data[0].url
        image_bytes = requests.get(image_url).content
        pricing = self.OPENAI_PRICING.get("gpt-4o", {})
        image_price = pricing.get("image_per_1_image", 0)
        self._apply_cost(cost=image_price)
        return image_bytes
    
    def build_materials_for_rag(self, text, max_chunk_size=1000, embedding_model="text-embedding-3-large", progress_callback=None):
        """
        Build materials for RAG (Retrieval-Augmented Generation):
        For each chunk, generate:
        {
            "html": "...",        # HTML output for the chunk
            "text": "...",        # Plain text output for the chunk
            "vector": [...]        # Vector format (embedding-ready text for OpenAI query)
        }
        Args:
            text (str): The input text (can be HTML)
            max_chunk_size (int): Max size of each chunk. Default 1000.
            embedding_model (str): OpenAI embedding model name. Default "text-embedding-3-large".
        Returns:
            list: List of dicts for all chunks
        """
        chunks = self.build_chunks(text, max_chunk_size=max_chunk_size)
        materials = []
        for i, chunk in enumerate(chunks):
            msg = f"Processing chunk {i+1}/{len(chunks)} for embeddings..."
            if progress_callback:
                progress_callback(chunk=chunk, index=i+1, total=len(chunks))
            else:
                print(msg)
            html_output = chunk["html"]
            text_output = chunk["text"]
            embedding_text = text_output
            try:
                response = self.OPEN_AI_CLIENT.embeddings.create(
                    model=embedding_model,
                    input=embedding_text
                )
                vector_output = response.data[0].embedding if response and response.data and response.data[0].embedding else []
                usage = getattr(response, "usage", None)
                if usage:
                    input_tokens = getattr(usage, "prompt_tokens", 0)
                else:
                    input_tokens = max(1, len(embedding_text) // 4)
                pricing = self.OPENAI_PRICING.get(embedding_model, {})
                input_price = pricing.get("input_per_1k_token", 0)
                cost = (input_tokens / 1000) * input_price
                self._apply_cost(cost=cost, service="OPEN_AI_EMBEDDING")
            except Exception as e:
                err_msg = f"Error generating embedding: {e}"
                if progress_callback:
                    progress_callback(err_msg, chunk=chunk, index=i+1, total=len(chunks))
                else:
                    print(err_msg)
                vector_output = []
            materials.append({
                "chunk_number": i + 1,
                "html": html_output,
                "text": text_output,
                "vector": vector_output
            })
        return materials