import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Div from "@/baseComponents/reusableComponents/Div";
import Icon from "@/baseComponents/reusableComponents/Icon";

import { COLORS } from "@/constants/vars";
import { PAGE_ROUTES } from "@/constants/pageRoutes";

const Syllabus = ({ teachingResources }) => {
  const router = useRouter();

  const [modules, setModules] = useState([]);

  useEffect(() => {
    if (teachingResources?.course?.public_modules) {
      setModules(teachingResources?.course?.public_modules);
    }
  }, [teachingResources]);

  return (
    <>
      {modules?.map((module, idx) => (
        <Div key={idx} className="bg-theme-three p-all-16 m-b-32 br-rad-px-10">
          <Div className="f-b f-s-px-20 m-b-16">{module?.title}</Div>
          <Div>
            {module?.topics?.map((topic, topicIdx) => (
              <Div type="flex" key={topicIdx} className="p-x-16 m-b-8">
                <Div
                  type="flex"
                  vAlign="center"
                  className="mouse-hand"
                  onClick={() =>
                    router.push(
                      `${PAGE_ROUTES.APP.COURSE_TEACHER_DASHBOARD}/${teachingResources?.course?.slug}/${topic?.id}`
                    )
                  }
                >
                  <Div>
                    {topicIdx + 1}.{" "}
                    <span className="text-underline">{topic?.title}</span> [
                    {topic?.audio_length_seconds
                      ? `${Math.floor(topic?.audio_length_seconds / 60)
                          .toString()
                          .padStart(2, "0")}:${(
                          topic?.audio_length_seconds % 60
                        )
                          .toString()
                          .padStart(2, "0")} mins`
                      : "N/A"}
                    ]
                  </Div>
                  <Div
                    type="flex"
                    hAlign="center"
                    vAlign="center"
                    className="width-px-30 height-px-30 m-l-8"
                  >
                    <Icon
                      type="circle-play"
                      scale={1.5}
                      color={COLORS?.["theme-two"]}
                    />
                  </Div>
                </Div>
              </Div>
            ))}
          </Div>
        </Div>
      ))}
    </>
  );
};

export default Syllabus;
