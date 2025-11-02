import { useState, useEffect, useRef } from "react";
import cx from "classnames";

import Div from "@/baseComponents/reusableComponents/Div";
import Icon from "@/baseComponents/reusableComponents/Icon";
import AreaText from "@/baseComponents/formComponents/AreaText";
import VoiceRecorder from "@/baseComponents/reusableComponents/VoiceRecorder";

import { COLORS } from "@/constants/vars";

import ChatLoader from "./subs/ChatLoader";
import styles from "./ChatBox.module.scss";

const ChatBox = ({
  goBottomOfTheContainer,
  setGoBottomOfTheContainer,
  userChatMessage,
  setUserChatMessage,
  handleChunk,
  handleAudioComplete,
  showLoader,
  setIsRecording,
  mainContainerClassName,
  mainContainerStyle = {},
  onMessageSentClick,
  chunkDurationInSecond = 60,
  children,
}) => {
  const messagesContainerRef = useRef(null);
  const timeoutRef = useRef();
  const safetyRef = useRef();

  const [recording, setRecording] = useState(false);
  const [hoveredItem, setHoveredItem] = useState("");

  useEffect(() => {
    setIsRecording(recording);
  }, [recording]);

  useEffect(() => {
    const container = messagesContainerRef?.current;

    if (
      goBottomOfTheContainer &&
      container &&
      typeof container.scrollTop === "number" &&
      typeof container.scrollHeight === "number"
    ) {
      // Scroll to bottom
      container.scrollTop = container.scrollHeight;

      // Clear any pending timers
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (safetyRef.current) {
        clearTimeout(safetyRef.current);
      }

      // Short reset (normal case)
      timeoutRef.current = setTimeout(() => {
        setGoBottomOfTheContainer(false);
        timeoutRef.current = null;
      }, 10);

      // Safety reset (forceful fallback, e.g. 200ms)
      safetyRef.current = setTimeout(() => {
        setGoBottomOfTheContainer(false);
        safetyRef.current = null;
      }, 200);
    }

    return () => {
      // Cleanup
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (safetyRef.current) {
        clearTimeout(safetyRef.current);
        safetyRef.current = null;
      }
    };
  }, [goBottomOfTheContainer]);

  return (
    <Div
      type="flex"
      direction="vertical"
      className={cx("of-hidden width-per-100", mainContainerClassName)}
      style={mainContainerStyle}
    >
      <Div
        type="flex"
        direction="vertical"
        className="flex--grow--1 of-hidden br-all-solid-2 br-rad-px-10 br-theme-one width-per-100"
      >
        <Div
          className={cx(
            "width-per-100 flex--grow--1 of-y-auto scroll-type-one p-all-16 of-x-hidden",
            styles.botMessageContainer
          )}
          ref={(el) => (messagesContainerRef.current = el)}
        >
          {children}
          {showLoader ? <ChatLoader /> : null}
        </Div>

        <Div
          type="flex"
          vAlign="center"
          className="width-per-100 flex--shrink--0 height-px-100 br-top-solid-2 br-theme-one"
        >
          <Div type="flex" className="width-per-100">
            <Div className="flex--grow--1">
              <AreaText
                placeHolder="Type your message..."
                value={userChatMessage}
                onChange={(e) => setUserChatMessage(e.target.value)}
                disabled={recording}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (onMessageSentClick) {
                      onMessageSentClick();
                    }
                  }
                }}
              />
            </Div>
            <Div>
              <VoiceRecorder
                onChunk={handleChunk}
                onComplete={handleAudioComplete}
                recording={recording}
                setRecording={setRecording}
                chunkDurationInSecond={chunkDurationInSecond}
              />
            </Div>
            <Div type="flex" vAlign="center">
              <Div
                type="flex"
                hAlign="center"
                vAlign="center"
                className={cx("width-px-50 height-px-50 mouse-hand")}
                onMouseEnter={() => setHoveredItem("send_message")}
                onMouseLeave={() => setHoveredItem("")}
                onClick={() => {
                  if (onMessageSentClick) {
                    onMessageSentClick();
                  } else {
                    console.log("No onMessageSentClick function provided.");
                  }
                }}
              >
                <Icon
                  type={"paper-plane"}
                  scale={2}
                  color={
                    hoveredItem === "send_message"
                      ? "blue"
                      : COLORS["theme-two"]
                  }
                />
              </Div>
              <Div
                type="flex"
                hAlign="center"
                vAlign="center"
                onClick={() => setRecording(!recording)}
                onMouseEnter={() => setHoveredItem("microphone")}
                onMouseLeave={() => setHoveredItem("")}
                className={cx(
                  "width-px-50 height-px-50 mouse-hand",
                  styles.microphoneContainer,
                  { [styles.recording]: recording }
                )}
              >
                <Icon
                  type={recording ? "stop-circle" : "microphone"}
                  scale={2}
                  color={
                    hoveredItem === "microphone" ? "blue" : COLORS["theme-two"]
                  }
                />
              </Div>
            </Div>
          </Div>
        </Div>
      </Div>
    </Div>
  );
};

export default ChatBox;
