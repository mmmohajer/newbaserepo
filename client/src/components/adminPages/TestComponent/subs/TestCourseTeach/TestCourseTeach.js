import { useState, useEffect, useRef } from "react";
import cx from "classnames";

import Div from "@/baseComponents/reusableComponents/Div";
import Button from "@/baseComponents/reusableComponents/Button";
import DivConvertTextToHtml from "@/baseComponents/reusableComponents/DivConvertTextToHtml";
import Typing from "@/baseComponents/reusableComponents/Typing";

import useApiCalls from "@/hooks/useApiCalls";
import { COURSE_API_ROUTE } from "@/constants/apiRoutes";

import styles from "./TestCourseTeach.module.scss";

const TestCourseTeach = () => {
  const containerRef = useRef(null);
  const slidesContainerRef = useRef(null);
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [slides, setSlides] = useState([]);
  const [audioSrc, setAudioSrc] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  // -----------------------------------
  // Fetch course data
  // -----------------------------------
  const [alignments, setAlignments] = useState([]);
  const [sendFetchCourseRequest, setSendFetchCourseRequest] = useState(false);
  const { status: fetchCourseStatus, data: courseApiData } = useApiCalls({
    sendReq: sendFetchCourseRequest,
    setSendReq: setSendFetchCourseRequest,
    method: "GET",
    url: COURSE_API_ROUTE,
    showLoading: true,
    showErrerMessage: true,
  });

  useEffect(() => {
    if (courseApiData) {
      if (courseApiData.audio) {
        setAudioSrc(courseApiData.audio);
      }

      if (courseApiData?.alignments) {
        setAlignments(courseApiData.alignments);
      }
    }
  }, [courseApiData]);
  useEffect(() => {
    setSendFetchCourseRequest(true);
  }, []);
  // -----------------------------------
  // -----------------------------------
  useEffect(() => {
    const localSlides = alignments?.filter(
      (item) => item?.start_time_to_display_slide_content <= currentTime
    );
    setSlides([...localSlides]);
  }, [alignments, currentTime]);

  useEffect(() => {
    if (containerRef?.current?.clientHeight) {
      setContainerHeight(containerRef.current.clientHeight);
    }
  }, [containerRef?.current]);

  useEffect(() => {
    if (slidesContainerRef?.current) {
      setTimeout(() => {
        slidesContainerRef?.current?.scrollTo({
          top: slidesContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 500);
    }
  }, [slides]);

  return (
    <>
      <Div
        ref={(el) => (containerRef.current = el)}
        type="flex"
        direction="vertical"
        distributedBetween
        className="flex--grow--1 width-per-100 br-rad-px-10 of-hidden"
        style={{ height: containerHeight }}
      >
        <Div
          ref={(el) => (slidesContainerRef.current = el)}
          type="flex"
          direction="vertical"
          className={cx(
            "flex--grow--1 bg-theme-two p-all-16 width-per-100 of-y-auto of-x-hidden scroll-type-one",
            styles.container
          )}
        >
          {slides.map((slide, index) => (
            <Div
              key={index}
              className={cx(
                "global-transition-one width-per-100 text-theme-one",
                styles.slideCard
              )}
            >
              <DivConvertTextToHtml text={slide?.content} speed={50} />
            </Div>
          ))}
        </Div>
        <Div
          type="flex"
          hAlign="center"
          className="p-all-16 bg-theme-six br-t-solid-2 br-theme-one flex--shrink-0"
        >
          <audio
            ref={audioRef}
            src={audioSrc}
            controls
            onTimeUpdate={(e) => {
              try {
                setCurrentTime(e.target.currentTime);
              } catch (error) {
                setCurrentTime(0);
              }
            }}
            onLoadedMetadata={(e) => setDuration(e.target.duration)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          />
        </Div>
      </Div>
    </>
  );
};

export default TestCourseTeach;
