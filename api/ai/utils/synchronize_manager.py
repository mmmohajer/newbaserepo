from django.conf import settings
import json
from google.cloud import texttospeech
import base64
import re
from xml.etree import ElementTree as ET

from ai.utils.open_ai_manager import OpenAIManager
from ai.utils.google_ai_manager import GoogleAIManager
from ai.utils.audio_manager import AudioManager
from ai.utils.azure_manager import AzureManager

# class SynchronizeManager():
#     def __init__(self, cur_user=None):
#         self.openai_manager = OpenAIManager(model="gpt-4o", api_key=settings.OPEN_AI_SECRET_KEY, cur_user=cur_user)
#         self.google_manager = GoogleAIManager(api_key=settings.GOOGLE_API_KEY, cur_user=cur_user)
#         self.audio_manager = AudioManager()
    
#     def full_synchronization_pipeline(self, instructions, stt_language="en-US", tts_encoding=None, max_token=2000):
#         """
#         Complete flow:
#         1. OpenAI: instructions → SSML + slides
#         2. Google TTS: SSML → audio
#         3. Google STT: audio → transcript + timestamps
#         4. OpenAI: transcript + slides → aligned slide/timestamp JSON
#         Returns:
#             dict: {
#                 "audio_base64": ...,  # base64 audio
#                 "slide_alignment": [...],  # list of {time_to_start_show, html_for_this_section}
#             }
#         """
#         # Step 1: OpenAI generates SSML and slides
#         prompt = (
#             "Generate a JSON with two fields: 'ssml_speech_for_tts' (SSML for TTS) and 'slide_htmls' (array of HTML slides). "
#             "The SSML speech should cover everything that is shown in the slides, explaining all highlights, tables, code, lists, headings, and important info in detail. "
#             "The slides should be concise and only show key points, formulas, tables, code, lists, headings, and other important highlights that help the user quickly grasp what the speech covers. "
#             f"Instructions: {instructions}"
#         )
#         messages = [
#             {"role": "system", "content": "You are a master teacher and content generator."},
#             {"role": "user", "content": prompt}
#         ]
#         response1 = self.openai_manager.generate_response(max_token=max_token, messages=messages)
#         try:
#             result1 = json.loads(response1)
#         except Exception:
#             result1 = response1
#         ssml = result1.get("ssml_speech_for_tts", "")
#         slide_htmls = result1.get("slide_htmls", [])

#         # Step 2: Google TTS
#         if tts_encoding is None:
#             tts_encoding = texttospeech.AudioEncoding.LINEAR16
#         audio_bytes = self.google_manager.tts(ssml, audio_encoding=tts_encoding, language_code="en-US")
#         audio_base64 = base64.b64encode(audio_bytes).decode("utf-8")

#         # Step 3: Measure audio length (seconds)
        
#         audio_length_sec = self.audio_manager.get_wav_duration(audio_bytes)

#         # Step 4: Ask OpenAI to estimate slide timings
#         timing_prompt = (
#             f"Given the following slides: {slide_htmls}\n"
#             f"and the following speech text: {ssml}\n"
#             f"and an audio duration of {audio_length_sec:.2f} seconds, return ONLY a JSON array. Each item should be an object with 'start_time_to_display_slide_content' (integer, seconds) and 'content' (HTML for the slide). Example: [{{'start_time_to_display_slide_content': 30, 'content': '<h2>Title 1</h2>'}}, {{'start_time_to_display_slide_content': 55, 'content': '<h2>Title 2</h2>'}}]. Do NOT add any explanation, commentary, or extra text before or after the array. The slides should be complimentary to the speech, and should be shown exactly when the speech reaches the relevant content. Use the speech text to align the timing as accurately as possible."
#         )
#         timing_messages = [
#             {"role": "system", "content": "You are a helpful assistant for synchronizing slides with audio."},
#             {"role": "user", "content": timing_prompt}
#         ]
#         timing_response = self.openai_manager.generate_response(max_token=5000, messages=timing_messages)
#         try:
#             alignment = json.loads(timing_response)
#         except Exception:
#             alignment = []

#         return {
#             "audio_base64": audio_base64,
#             "slide_alignment": alignment
#         }

class SynchronizeManager():
    def __init__(self, cur_users=[]):
        self.openai_manager = OpenAIManager(
            model="gpt-4o",
            api_key=settings.OPEN_AI_SECRET_KEY,
            cur_users=cur_users
        )
        self.google_manager = GoogleAIManager(
            api_key=settings.GOOGLE_API_KEY,
            cur_users=cur_users
        )
        self.audio_manager = AudioManager()
        self.azure_manager = AzureManager(
            key=settings.AZURE_COGNITIVE_SERVICES_KEY_1,
            region=settings.AZURE_COGNITIVE_SERVICES_REGION
        )
    
    

    def normalize_marks(self, ssml):
        # Move <mark> into the following sentence
        ssml = re.sub(r"(<mark[^>]*/>)\s*<s>(.*?)</s>", r"<s>\1 \2</s>", ssml)
        return ssml
    
    def fix_ssml(self, ssml):
        # Ensure <speak> root
        if not ssml.strip().startswith("<speak>"):
            ssml = f"<speak>{ssml}</speak>"

        # Remove nested <s><s> → flatten
        ssml = ssml.replace("<s><s>", "<s>").replace("</s></s>", "</s>")

        # If <s> has only a <mark>, move mark into next/prev sentence
        ssml = re.sub(r"<s>\s*(<mark[^>]*/>)\s*</s>", r"\1", ssml)

        # Ensure no empty <s></s>
        ssml = re.sub(r"<s>\s*</s>", "", ssml)

        return ssml
    
    def sanitize_ssml(self, ssml_text):
        """
        Cleans and fixes invalid SSML for Google TTS timepoint generation.
        - Removes all nested <s> tags
        - Properly structures mark tags at sentence level
        - Ensures clean structure for Google TTS
        """
        # ----------------------------
        # 1. Ensure root <speak> and remove outer wrapper <s> if exists
        # ----------------------------
        if not ssml_text.strip().startswith("<speak>"):
            ssml_text = f"<speak>{ssml_text}</speak>"
        
        # Remove wrapping <s> tags around the entire content
        ssml_text = re.sub(r"^<speak><s>(.+)</s></speak>$", r"<speak>\1</speak>", ssml_text, flags=re.DOTALL)
        
        # ----------------------------
        # 2. Extract content inside <speak> tags
        # ----------------------------
        speak_content = ""
        speak_match = re.search(r"<speak>(.*)</speak>", ssml_text, re.DOTALL)
        if speak_match:
            speak_content = speak_match.group(1)
        else:
            speak_content = ssml_text.replace("<speak>", "").replace("</speak>", "")

        # ----------------------------
        # 3. Remove ALL existing <s> tags to start fresh
        # ----------------------------
        clean_content = re.sub(r"</?s>", "", speak_content)
        
        # ----------------------------
        # 4. Split by mark tags and reconstruct properly
        # ----------------------------
        mark_pattern = r'(<mark name="[^"]*"/>)'
        segments = re.split(mark_pattern, clean_content)
        
        reconstructed_ssml = "<speak>"
        
        i = 0
        while i < len(segments):
            segment = segments[i].strip()
            
            if segment.startswith('<mark name='):
                # This is a mark tag - combine with next segment
                mark_tag = segment
                content = ""
                if i + 1 < len(segments):
                    content = segments[i + 1].strip()
                    # Remove any content that should go to next mark
                    next_mark_pos = content.find('<mark name=')
                    if next_mark_pos != -1:
                        content = content[:next_mark_pos].strip()
                        # Put the remaining content back
                        segments[i + 1] = content[next_mark_pos:]
                
                if content:
                    reconstructed_ssml += f"<s>{mark_tag}{content}</s>"
                i += 2
            else:
                # Regular content - only add if no mark tags
                if segment and not segment.startswith('<mark'):
                    # Check if this segment has mark tags embedded
                    if '<mark name=' in segment:
                        # Split this segment further
                        sub_segments = re.split(mark_pattern, segment)
                        segments[i:i+1] = sub_segments
                        continue
                    else:
                        # Only add if it's at the beginning and has content
                        if i == 0 and segment:
                            reconstructed_ssml += f"<s>{segment}</s>"
                i += 1
        
        reconstructed_ssml += "</speak>"
        
        # ----------------------------
        # 5. Final cleanup
        # ----------------------------
        # Remove empty sentences
        reconstructed_ssml = re.sub(r"<s>\s*</s>", "", reconstructed_ssml)
        # Remove sentences with only marks
        reconstructed_ssml = re.sub(r"<s>(<mark[^>]*/>)\s*</s>", "", reconstructed_ssml)
        # Clean up whitespace
        reconstructed_ssml = re.sub(r"\s+", " ", reconstructed_ssml)
        reconstructed_ssml = re.sub(r">\s+<", "><", reconstructed_ssml)
        
        return reconstructed_ssml

    def validate_ssml_slides_alignment(self, ssml, slide_htmls):
        """
        Comprehensive validation to ensure SSML marks exactly match slides array length.
        
        Args:
            ssml (str): SSML content with <mark> tags
            slide_htmls (list): Array of HTML slide content
            
        Returns:
            dict: Validation result with details
        """
        # Count SSML marks
        ssml_marks = re.findall(r'<mark name="slide_(\d+)"', ssml)
        ssml_mark_count = len(ssml_marks)
        
        # Count slides
        slide_count = len(slide_htmls)
        
        # Check for any embedded marks in slides (shouldn't exist)
        embedded_marks_found = []
        for i, slide in enumerate(slide_htmls):
            embedded = re.findall(r'<mark name="slide_(\d+)"', slide)
            if embedded:
                embedded_marks_found.append(f"Slide {i+1}: {embedded}")
        
        # Check mark sequence (should be 1, 2, 3, ... with no gaps)
        expected_sequence = [str(i) for i in range(1, ssml_mark_count + 1)]
        actual_sequence = sorted(ssml_marks, key=int)
        sequence_valid = expected_sequence == actual_sequence
        
        validation_result = {
            "is_valid": ssml_mark_count == slide_count and sequence_valid and not embedded_marks_found,
            "ssml_mark_count": ssml_mark_count,
            "slide_count": slide_count,
            "ssml_marks": ssml_marks,
            "embedded_marks_found": embedded_marks_found,
            "sequence_valid": sequence_valid,
            "expected_sequence": expected_sequence,
            "actual_sequence": actual_sequence
        }
        
        return validation_result
    
    def fix_ssml_slides_alignment(self, ssml, slide_htmls, validation_result):
        """
        Fix alignment issues between SSML marks and slides.
        
        Args:
            ssml (str): SSML content
            slide_htmls (list): Array of slides
            validation_result (dict): Result from validate_ssml_slides_alignment
            
        Returns:
            tuple: (fixed_ssml, fixed_slide_htmls)
        """
        print(f"🔧 FIXING ALIGNMENT ISSUES:")
        
        # Remove any embedded marks from slides
        cleaned_slides = []
        for i, slide in enumerate(slide_htmls):
            cleaned_slide = re.sub(r'<mark name="[^"]*"/>', '', slide)
            if slide != cleaned_slide:
                print(f"   ✂️  Removed embedded marks from slide {i+1}")
            cleaned_slides.append(cleaned_slide)
        
        ssml_mark_count = validation_result["ssml_mark_count"]
        slide_count = len(cleaned_slides)
        
        # Truncate to minimum count to ensure alignment
        min_count = min(ssml_mark_count, slide_count)
        print(f"   📏 Truncating both to minimum count: {min_count}")
        
        # Truncate slides
        if slide_count > min_count:
            cleaned_slides = cleaned_slides[:min_count]
            print(f"   ✂️  Truncated slides from {slide_count} to {len(cleaned_slides)}")
        
        # Truncate SSML
        fixed_ssml = ssml
        if ssml_mark_count > min_count:
            print(f"   ✂️  Truncating SSML from {ssml_mark_count} marks to {min_count}")
            
            marks = list(re.finditer(r'<mark name="slide_(\d+)"', ssml))
            if len(marks) >= min_count and min_count > 0:
                last_valid_mark = marks[min_count - 1]
                search_start = last_valid_mark.start()
                sentence_end = ssml.find('</s>', search_start)
                
                if sentence_end != -1:
                    truncated_ssml = ssml[:sentence_end + 4] + '</speak>'
                    fixed_ssml = self.sanitize_ssml(truncated_ssml)
                    print(f"   ✂️  SSML truncated at sentence ending")
        
        return fixed_ssml, cleaned_slides

    
    def full_synchronization_pipeline(self, instructions, cur_message="", stt_language="en-US", tts_encoding=None, max_token=10000, voice_name="en-US-Wavenet-D"):
        """
        Complete flow:
        1. OpenAI: instructions → SSML + slides (with <mark> tags)
        2. Google TTS (REST): SSML → audio + timepoints
        3. Map SSML <mark> → slide timings
        Returns:
            dict: {
                "audio_base64": ...,  # base64 audio
                "slide_alignment": [...],  # list of {start_time_to_display_slide_content, content}
                "pipeline_success": bool,  # True only if both AI and TTS succeed, False otherwise
            }
        """

        # -------------------------------
        # SUCCESS TRACKING
        # -------------------------------
        pipeline_success = False  # Default to False, only True when both AI and TTS succeed

        # -------------------------------
        # Step 1: OpenAI generates SSML + slides
        # -------------------------------
        prompt = (
            "You are a content generator for an AI classroom assistant. "
            "Your task is to return ONLY valid JSON following the schema. "
            "The JSON will be consumed by the system, not the student. "
            "The system rules below are STRICTLY for you, not to be spoken or taught to the user.\n\n"

            "=== OUTPUT SCHEMA (MANDATORY) ===\n"
            "{\n"
            '  "ssml_speech_for_tts": "<SSML string>",\n'
            '  "slide_htmls": ["<slide-1 html>", "<slide-2 html>", ...]\n'
            "}\n\n"

            "=== SYSTEM RULES (DO NOT TEACH USER) ===\n"
            "GENERAL:\n"
            "- Always create at least 1 slide.\n"
            "- The number of slides MUST equal the number of <mark> tags in SSML.\n"
            "- Never return an empty slide_htmls array.\n"
            "- Maintain ONE-TO-ONE mapping: 1 slide = 1 <mark> = 1 explanation.\n"
            "- Mark tags must be named sequentially: slide_1, slide_2, slide_3, etc.\n"
            "- Each slide corresponds to exactly one mark tag in the SSML.\n"
            "- VALIDATION RULE: Count your <mark> tags and ensure you have the same number of slides.\n"
            "- If you have 10 <mark> tags, you MUST have exactly 10 slides in the array.\n"
            "- CRITICAL: Before returning your JSON, COUNT the <mark> tags in your SSML and COUNT the slides in your array. They MUST be equal.\n"
            "- If they don't match, either remove extra <mark> tags or add missing slides to balance them.\n\n"

            "SSML RULES (STRICT for Google TTS):\n"
            "1) Wrap everything in <speak>...</speak>.\n"
            "2) CRITICAL STRUCTURE: ONLY use this pattern:\n"
            "   <s><mark name=\"slide_X\"/>Complete content for this slide goes here</s>\n"
            "   <s><mark name=\"slide_Y\"/>Complete content for next slide goes here</s>\n"
            "3) ABSOLUTELY FORBIDDEN:\n"
            "   - <s><s>content</s></s> (nested sentences)\n"
            "   - <prosody><s>content</s></prosody> (sentences inside prosody)\n"
            "   - <s>content <s>more</s></s> (sentences inside sentences)\n"
            "   - HTML tags: <br>, <div>, <span>, <p>, <h1-h6>, <ul>, <ol>, <li>\n"
            "   - URLs or email addresses (spell them out or describe them)\n"
            "4) CORRECT EXAMPLES:\n"
            "   <s><mark name=\"slide_1\"/>Text with <prosody>enhanced speech</prosody> here.</s>\n"
            "   <s><mark name=\"slide_2\"/>More <emphasis>important</emphasis> content.</s>\n"
            "5) Each mark tag must be immediately after <s> with no space.\n"
            "6) Content guidelines:\n"
            "   - Spell out symbols: 'at sign' not '@', 'percent' not '%'\n"
            "   - Use phonetic spelling for complex terms when needed\n"
            "7) Use prosody and rate tags INSIDE the <s> content:\n"
            "   - <prosody rate=\"slow|medium|fast\" pitch=\"low|medium|high\" volume=\"soft|medium|loud\">text</prosody>\n"
            "   - <emphasis level=\"strong|moderate\">text</emphasis>\n"
            "   - <break time=\"0.5s|1s|2s\"/> for dramatic pauses\n"
            "   - Vary rate: slow for important concepts, fast for excitement\n"
            "   - Use pitch changes for emphasis and engagement\n"
            "   - Add emphasis to key terms and concepts\n"
            "8) Make speech dynamic and engaging:\n"
            "   - Start with medium rate, vary throughout\n"
            "   - Use slower rate for complex explanations\n"
            "   - Use faster rate for examples or excitement\n"
            "   - Lower pitch for serious concepts, higher for enthusiasm\n"
            "   - Add strategic breaks for comprehension\n"
            "9) Explain code in plain English (never read raw symbols).\n"
            "10) Speech must sound natural, conversational, like an enthusiastic teacher.\n"
            "11) Engagement questions ONLY at the end of the speech.\n\n"

            "SLIDE RULES (CRITICAL - SLIDES ARE VISUAL AIDS, NOT SPEECH TRANSCRIPTS):\n"
            "- Each slide must be valid, self-contained HTML.\n"
            "- NEVER repeat the exact speech content in slides.\n"
            "- Slides should be COMPLEMENTARY visual aids that highlight key concepts.\n"
            "- VARY SLIDE FORMATS - Choose the MOST EFFECTIVE presentation method for each concept:\n\n"
            
            "SLIDE CONTENT TYPES (select the best format for each concept):\n"
            "1. CODE SNIPPETS: Use <pre><code>...</code></pre> with complete, executable code\n"
            "   - Best for: examples, syntax demonstration, implementation details\n"
            "   - Include proper indentation and comments when helpful\n\n"
            
            "2. DEFINITION SLIDES: Use clean heading + paragraph format\n"
            "   - Format: <h2>Concept Name</h2><p>Clear, concise definition or explanation</p>\n"
            "   - Best for: introducing new terms, explaining abstract concepts\n"
            "   - Keep paragraphs short (1-3 sentences max)\n\n"
            
            "3. COMPARISON TABLES: Use structured tables for side-by-side analysis\n"
            "   - Format: <table><thead><tr><th>Aspect</th><th>Option A</th><th>Option B</th></tr></thead><tbody>...</tbody></table>\n"
            "   - Best for: comparing technologies, pros/cons, feature differences\n"
            "   - Include clear headers and aligned content\n\n"
            
            "4. HIERARCHICAL LISTS: Use when showing relationships or categories\n"
            "   - Bullet points: <ul><li>Main point<ul><li>Sub-point</li></ul></li></ul>\n"
            "   - Numbered steps: <ol><li>First step</li><li>Second step</li></ol>\n"
            "   - Best for: processes, hierarchies, feature lists\n\n"
            
            "5. VISUAL STRUCTURES: Use headings and emphasis for key information\n"
            "   - Format: <h2>Main Topic</h2><h3>Subtopic</h3><p><strong>Key point:</strong> <em>important detail</em></p>\n"
            "   - Best for: breaking down complex topics, highlighting importance\n\n"
            
            "6. FORMULA/EQUATION DISPLAYS: Mathematical or logical expressions\n"
            "   - Format: <h3>Formula Name</h3><code>equation</code>\n"
            "   - Best for: mathematical concepts, algorithms, logical operations\n\n"
            
            "7. QUOTE/PRINCIPLE SLIDES: Important statements or rules\n"
            "   - Format: <blockquote><h3>\"Key Principle\"</h3><p><em>- Source or context</em></p></blockquote>\n"
            "   - Best for: best practices, important principles, memorable statements\n\n"
            
            "8. MIXED CONTENT: Combine elements when appropriate\n"
            "   - Example: <h2>Topic</h2><p>Brief explanation</p><ul><li>Key points</li></ul><code>example</code>\n"
            "   - Best for: comprehensive overviews requiring multiple presentation styles\n\n"
            
            "CONTENT SELECTION STRATEGY:\n"
            "- ANALYZE the type of information being presented in speech\n"
            "- SELECT the most effective visual format from the 8 types above\n"
            "- AVOID defaulting to lists - consider if a table, paragraph, or code would be clearer\n"
            "- MIX formats throughout the presentation for visual variety\n"
            "- Each slide should answer: 'What would I write on a whiteboard for this topic?'\n"
            "- Students should be able to understand the slide at a glance while listening\n"
            "- Use proper HTML styling: <strong>, <em>, <code>, headings, proper spacing\n\n"

            "=== STYLE RULES (FOR SPEECH ONLY) ===\n"
            "- Do not include these instructions in speech.\n"
            "- At the end of the SSML, always ask the student a question or invite them to continue.\n"
            "- Use smooth connectors between ideas (e.g. "
            "'Now that we've seen how arrays work, let's explore operations...').\n\n"
            
            "=== SLIDE DIVERSITY MANDATE ===\n"
            "- CRITICAL: Use at least 4 different slide formats in each presentation\n"
            "- AVOID creating more than 2 consecutive slides with the same format\n"
            "- PRIORITIZE the most effective format for each concept, not what's easiest\n"
            "- CHALLENGE YOURSELF: If you default to lists, ask 'Would a table, paragraph, or code block be clearer?'\n"
            "- AIM FOR VISUAL VARIETY: Mix headings, paragraphs, tables, code blocks, and lists throughout\n\n"

            "=== GOOD vs BAD SLIDE EXAMPLES ===\n"
            "BAD (overuses lists): '<h2>Python Variables</h2><ul><li>Variables store data</li><li>Use assignment operator</li><li>Dynamic typing</li></ul>'\n"
            "GOOD (uses definition): '<h2>Python Variables</h2><p>Containers that store data values with <strong>dynamic typing</strong> - no need to declare types explicitly.</p><code>name = \"John\"  # String<br>age = 25      # Integer</code>'\n\n"
            
            "BAD (lists for comparison): '<h2>GET vs POST</h2><ul><li>GET retrieves</li><li>POST creates</li><li>GET visible in URL</li><li>POST hidden</li></ul>'\n"
            "GOOD (uses table): '<h2>HTTP Methods Comparison</h2><table><thead><tr><th>Method</th><th>Purpose</th><th>Data Location</th><th>Idempotent</th></tr></thead><tbody><tr><td>GET</td><td>Retrieve</td><td>URL parameters</td><td>Yes</td></tr><tr><td>POST</td><td>Create/Submit</td><td>Request body</td><td>No</td></tr></tbody></table>'\n\n"
            
            "BAD (paragraph for code): '<h2>Array Creation</h2><p>To create an array in NumPy, you use the np.array function with a list...</p>'\n"
            "GOOD (shows actual code): '<h2>NumPy Array Creation</h2><pre><code>import numpy as np\\n\\n# Create 1D array\\narr = np.array([1, 2, 3, 4])\\nprint(arr)  # [1 2 3 4]\\n\\n# Create 2D array\\nmatrix = np.array([[1, 2], [3, 4]])</code></pre>'\n\n"
            
            "BAD (list for formula): '<h2>Quadratic Formula</h2><ul><li>x equals negative b</li><li>plus or minus square root</li><li>b squared minus 4ac</li></ul>'\n"
            "GOOD (displays formula): '<h2>Quadratic Formula</h2><code>x = (-b ± √(b² - 4ac)) / 2a</code><p><em>Where a, b, c are coefficients of ax² + bx + c = 0</em></p>'\n\n"
            
            "BAD (list for principle): '<h2>DRY Principle</h2><ul><li>Don't Repeat Yourself</li><li>Avoid duplication</li><li>Write reusable code</li></ul>'\n"
            "GOOD (uses quote format): '<h2>DRY Principle</h2><blockquote><h3>\"Don\\'t Repeat Yourself\"</h3><p><em>Every piece of knowledge must have a single, unambiguous representation within a system.</em></p></blockquote>'\n\n"

            "=== CODE EXPLANATION BEHAVIOR (NEW) ===\n"
            "- When a code block is present, treat EVERY line of code as its own explanation step.\n"
            "- Generate one <mark> tag and one slide for EACH line of code.\n"
            "- Each slide should display exactly one code line inside <pre><code>...</code></pre>.\n"
            "- The SSML speech should explain that exact line clearly in plain English:\n"
            "   * Describe what the line does\n"
            "   * Mention the purpose of variables or operations\n"
            "   * Avoid reading raw syntax; instead, interpret meaning\n"
            "   * Example: Instead of saying 'print open bracket', say 'this line prints the message to the screen.'\n"
            "- End with one final slide for student engagement or challenge.\n\n"
            
            f"Instructions for current session:\n{instructions}"
        )


        messages = [
            {"role": "system", "content": "You are a master teacher and content generator."},
            {"role": "system", "content": prompt}
        ]
        if cur_message:
            messages.append({"role": "user", "content": cur_message})

        # -------------------------------
        # FULL PIPELINE RETRY LOOP (AI + TTS)
        # -------------------------------
        max_pipeline_retries = 6  # Total pipeline attempts (AI + TTS)
        pipeline_retry_count = 0
        
        while pipeline_retry_count <= max_pipeline_retries:
            print(f"🚀 PIPELINE ATTEMPT {pipeline_retry_count + 1}/{max_pipeline_retries + 1}")
            
            # -------------------------------
            # INNER RETRY LOOP: AI GENERATION WITH VALIDATION
            # -------------------------------
            max_retries = 6
            retry_count = 0
            ssml = ""
            slide_htmls = []
            
            while retry_count <= max_retries:
                print(f"🔄 Generation attempt {retry_count + 1}/{max_retries + 1}")
                
                # Add retry context if not the first attempt
                retry_messages = messages.copy()
                if retry_count > 0:
                    retry_prompt = f"""
                    **RETRY ATTEMPT {retry_count + 1}**: The previous generation failed validation.
                    **CRITICAL**: Ensure the number of <mark name="slide_X"/> tags in your SSML exactly matches the number of items in your slide_htmls array.
                    **COUNT BEFORE SUBMITTING**: If you have X number of <mark> tags, you MUST have exactly X slides in the array.
                    **NO EMBEDDED MARKS**: Do not put <mark> tags inside slide HTML content - they belong only in SSML.
                    **SEQUENTIAL MARKS**: Use slide_1, slide_2, slide_3, etc. with no gaps or duplicates.
                    """
                    retry_messages.append({"role": "system", "content": retry_prompt})
                
                # Add pipeline-level retry context if this is a TTS failure retry
                if pipeline_retry_count > 0:
                    pipeline_retry_prompt = f"""
                    **PIPELINE RETRY {pipeline_retry_count + 1}**: The previous SSML failed to generate timepoints in Google TTS.
                    **TTS OPTIMIZATION NEEDED**: Your SSML marks may not be compatible with Google TTS timepoint generation.
                    **CRITICAL**: Ensure your <mark> tags follow Google TTS format exactly:
                    - Use <mark name="slide_1"/> not <mark name='slide_1'/>
                    - Ensure proper SSML structure: <speak><s><mark name="slide_1"/>content</s></speak>
                    - Keep mark names simple and sequential
                    - Avoid complex SSML elements that might interfere with mark detection
                    """
                    retry_messages.append({"role": "system", "content": pipeline_retry_prompt})

                response1 = self.openai_manager.generate_response(
                    max_token=max_token,
                    messages=retry_messages
                )

                # Robust JSON parsing
                result1 = {}
                try:
                    result1 = json.loads(response1)
                except Exception:
                    if isinstance(response1, dict):
                        result1 = response1
                    else:
                        print(f"⚠️  Attempt {retry_count + 1}: OpenAI did not return valid JSON")
                        retry_count += 1
                        continue

                ssml = result1.get("ssml_speech_for_tts", "")
                ssml = self.sanitize_ssml(ssml)
                slide_htmls = result1.get("slide_htmls", [])

                # -------------------------------
                # VALIDATION CHECK
                # -------------------------------
                print(f"🔍 Validating attempt {retry_count + 1}...")
                
                validation_result = self.validate_ssml_slides_alignment(ssml, slide_htmls)
                
                print(f"📊 VALIDATION RESULTS:")
                print(f"   SSML marks: {validation_result['ssml_mark_count']}")
                print(f"   Slides: {validation_result['slide_count']}")
                print(f"   SSML marks found: {validation_result['ssml_marks']}")
                print(f"   Sequence valid: {validation_result['sequence_valid']}")
                
                if validation_result['embedded_marks_found']:
                    print(f"   ⚠️  Embedded marks found in slides: {validation_result['embedded_marks_found']}")
                
                if not validation_result['sequence_valid']:
                    print(f"   ⚠️  Mark sequence invalid:")
                    print(f"      Expected: {validation_result['expected_sequence']}")
                    print(f"      Actual: {validation_result['actual_sequence']}")
                
                if validation_result['is_valid']:
                    print(f"✅ VALIDATION PASSED: Perfect alignment achieved on attempt {retry_count + 1}!")
                    break
                else:
                    print(f"❌ Attempt {retry_count + 1} failed validation: SSML marks ({validation_result['ssml_mark_count']}) ≠ slides ({validation_result['slide_count']})")
                    retry_count += 1
                    
                    if retry_count > max_retries:
                        print(f"🚨 Max AI retries ({max_retries + 1}) reached. Applying auto-fix as fallback...")
                        break

            # Final fallback: Auto-fix if all AI retries failed
            if retry_count > max_retries:
                print(f"🔧 APPLYING AUTO-FIX FALLBACK:")
                final_validation = self.validate_ssml_slides_alignment(ssml, slide_htmls)
                ssml, slide_htmls = self.fix_ssml_slides_alignment(ssml, slide_htmls, final_validation)
                
                # Re-validate after fixes
                post_fix_validation = self.validate_ssml_slides_alignment(ssml, slide_htmls)
                if post_fix_validation['is_valid']:
                    print(f"✅ AUTO-FIX SUCCESS: Alignment restored!")
                else:
                    print(f"⚠️  AUTO-FIX PARTIAL: Some issues remain")
                    print(f"     Final counts - SSML: {post_fix_validation['ssml_mark_count']}, Slides: {post_fix_validation['slide_count']}")

            # Final verification and summary
            final_mark_count = len(re.findall(r'<mark name="slide_\d+"', ssml))
            final_slide_count = len(slide_htmls)
            
            print(f"📋 FINAL SUMMARY:")
            print(f"   SSML marks: {final_mark_count}")
            print(f"   Slides: {final_slide_count}")
            print(f"   Status: {'✅ ALIGNED' if final_mark_count == final_slide_count else '⚠️ MISALIGNED'}")
            
            if final_mark_count != final_slide_count:
                print(f"   ⚠️  This may cause synchronization issues in the frontend!")

            # -------------------------------
            # TTS GENERATION AND VALIDATION
            # -------------------------------
            if tts_encoding is None:
                tts_encoding = "LINEAR16"   # must be string for REST
            elif not isinstance(tts_encoding, str):
                # Normalize enum-like values into string
                tts_encoding = str(tts_encoding).split(".")[-1]
            
            # TTS retry loop for timepoints validation
            max_tts_retries = 3
            tts_retry_count = 0
            audio_bytes = None
            timepoints = []
            audio_base64 = ""
            expected_timepoints = len(slide_htmls)
            tts_success = False
            
            print(f"🎵 GENERATING TTS WITH TIMEPOINTS...")
            print(f"   Expected timepoints: {expected_timepoints} (to match {len(slide_htmls)} slides)")
            
            while tts_retry_count <= max_tts_retries:
                print(f"🔄 TTS attempt {tts_retry_count + 1}/{max_tts_retries + 1}")
                
                try:
                    tts_result = self.google_manager.advanced_tts(
                        ssml,
                        audio_encoding=tts_encoding,
                        language_code=stt_language,
                        voice_name=voice_name
                    )
                    audio_bytes = tts_result["audio_content"]
                    timepoints = tts_result.get("timepoints", [])
                    audio_base64 = base64.b64encode(audio_bytes).decode("utf-8")
                    
                    print(f"🔍 TTS attempt {tts_retry_count + 1} - Timepoints: {len(timepoints)} vs Expected: {expected_timepoints}")
                    
                    # Validate timepoints count
                    if len(timepoints) == expected_timepoints and len(timepoints) > 0:
                        print(f"✅ TTS SUCCESS: Perfect timepoint match on attempt {tts_retry_count + 1}!")
                        tts_success = True
                        pipeline_success = True  # Both AI and TTS succeeded!
                        break
                    elif len(timepoints) == 0:
                        print(f"❌ TTS attempt {tts_retry_count + 1}: No timepoints generated")
                    else:
                        print(f"❌ TTS attempt {tts_retry_count + 1}: {len(timepoints)} timepoints ≠ {expected_timepoints} expected")
                    
                    tts_retry_count += 1
                    
                    if tts_retry_count > max_tts_retries:
                        print(f"🚨 TTS max retries ({max_tts_retries + 1}) reached.")
                        break
                        
                except Exception as e:
                    print(f"❌ TTS attempt {tts_retry_count + 1} failed with error: {e}")
                    tts_retry_count += 1
                    if tts_retry_count > max_tts_retries:
                        print("🚨 TTS completely failed with exceptions.")
                        break
            
            # Check if TTS was successful or if we should retry the entire pipeline
            if tts_success:
                print(f"✅ TTS SUCCESS: Breaking out of pipeline retry loop")
                break
            elif pipeline_retry_count < max_pipeline_retries:
                print(f"❌ TTS FAILED: Retrying entire pipeline (attempt {pipeline_retry_count + 2})...")
                print(f"    Reason: TTS could not generate timepoints from current SSML")
                pipeline_retry_count += 1
                continue
            else:
                print(f"🚨 ALL PIPELINE ATTEMPTS EXHAUSTED: Applying final fallback timepoints")
                break
        
        # Final timepoints handling (only reached if all pipeline attempts failed)
        if not tts_success:
            print(f"🔧 TIMEPOINTS VALIDATION AND CORRECTION:")
            print(f"   Generated timepoints: {len(timepoints)}")
            print(f"   Expected (slides): {expected_timepoints}")
            
            if len(timepoints) != expected_timepoints:
                print(f"⚠️  TIMEPOINTS MISMATCH DETECTED!")
                
                if len(timepoints) > expected_timepoints:
                    print(f"   ✂️  Truncating timepoints from {len(timepoints)} to {expected_timepoints}")
                    timepoints = timepoints[:expected_timepoints]
                elif len(timepoints) < expected_timepoints and len(timepoints) > 0:
                    print(f"   📈 Interpolating missing timepoints from {len(timepoints)} to {expected_timepoints}")
                    # Generate additional timepoints by extending the pattern
                    if audio_bytes:
                        audio_duration = self.audio_manager.get_wav_duration(audio_bytes)
                        time_per_slide = audio_duration / expected_timepoints
                        
                        # Add missing timepoints
                        for i in range(len(timepoints), expected_timepoints):
                            timepoints.append({
                                "timeSeconds": i * time_per_slide,
                                "markName": f"slide_{i+1}"
                            })
                        print(f"   ✅ Added {expected_timepoints - len(timepoints)} interpolated timepoints")
                elif len(timepoints) == 0 and expected_timepoints > 0:
                    print(f"   🚨 No timepoints generated, creating fallback timepoints")
                    # Generate fallback timepoints by dividing audio equally
                    if audio_bytes:
                        audio_duration = self.audio_manager.get_wav_duration(audio_bytes)
                        time_per_slide = audio_duration / expected_timepoints
                        
                        timepoints = []
                        for i in range(expected_timepoints):
                            timepoints.append({
                                "timeSeconds": i * time_per_slide,
                                "markName": f"slide_{i+1}"
                            })
                        print(f"   ✅ Generated {len(timepoints)} fallback timepoints")
            else:
                print(f"✅ TIMEPOINTS PERFECT: {len(timepoints)} timepoints match {expected_timepoints} slides")

        
        # Final timepoints validation
        final_timepoints_count = len(timepoints)
        final_slides_count = len(slide_htmls)
        final_marks_count = len(re.findall(r'<mark name="slide_\d+"', ssml))
        
        print(f"📋 FINAL ALIGNMENT CHECK:")
        print(f"   SSML marks: {final_marks_count}")
        print(f"   Slides: {final_slides_count}")
        print(f"   Timepoints: {final_timepoints_count}")
        
        # Ensure all three components are aligned
        if final_marks_count == final_slides_count == final_timepoints_count:
            print(f"✅ PERFECT TRIPLE ALIGNMENT: All counts = {final_slides_count}")
        else:
            print(f"⚠️  ALIGNMENT ISSUES DETECTED:")
            print(f"     Applying final synchronization fix...")
            
            # Get minimum count across all three
            min_count = min(final_marks_count, final_slides_count, final_timepoints_count)
            print(f"     Truncating all to minimum: {min_count}")
            
            # Truncate all arrays to minimum count
            if len(slide_htmls) > min_count:
                slide_htmls = slide_htmls[:min_count]
                print(f"     ✂️  Slides truncated to {len(slide_htmls)}")
                
            if len(timepoints) > min_count:
                timepoints = timepoints[:min_count]
                print(f"     ✂️  Timepoints truncated to {len(timepoints)}")
                
            if final_marks_count > min_count:
                # Re-truncate SSML if needed
                marks = list(re.finditer(r'<mark name="slide_(\d+)"', ssml))
                if len(marks) >= min_count and min_count > 0:
                    last_valid_mark = marks[min_count - 1]
                    search_start = last_valid_mark.start()
                    sentence_end = ssml.find('</s>', search_start)
                    if sentence_end != -1:
                        truncated_ssml = ssml[:sentence_end + 4] + '</speak>'
                        ssml = self.sanitize_ssml(truncated_ssml)
                        print(f"     ✂️  SSML re-truncated to {min_count} marks")
            
            print(f"✅ FINAL SYNCHRONIZATION COMPLETE: All components aligned to {min_count} items")

        # -------------------------------
        # Step 3: Map timepoints → slides
        # -------------------------------
        alignment = []
        for tp, slide in zip(timepoints, slide_htmls):
            alignment.append({
                "start_time_to_display_slide_content": int(tp.get("timeSeconds", 0)),
                "content": slide
            })
        
        audio_length_sec = self.audio_manager.get_wav_duration(audio_bytes)
        return {
            "audio_base64": audio_base64,
            "slide_alignment": alignment,
            "ssml": ssml,
            "audio_length_sec": audio_length_sec,
            "timepoints": timepoints,
            "pipeline_success": pipeline_success
        }