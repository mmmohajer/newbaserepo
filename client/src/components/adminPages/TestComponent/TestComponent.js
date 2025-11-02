import Div from "@/baseComponents/reusableComponents/Div";

import AppSectionContainer from "@/components/wrappers/AppSectionContainer";

import TestCourseTeach from "./subs/TestCourseTeach";

const TestComponent = () => {
  return (
    <>
      <AppSectionContainer hasFullHeight>
        <TestCourseTeach />
      </AppSectionContainer>
    </>
  );
};

export default TestComponent;
