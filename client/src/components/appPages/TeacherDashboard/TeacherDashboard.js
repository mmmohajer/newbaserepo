import { useState, useEffect } from "react";

import Div from "@/baseComponents/reusableComponents/Div";
import AppSectionContainer from "@/components/wrappers/AppSectionContainer";

import useApiCalls from "@/hooks/useApiCalls";
import { COURSE_TEACHING_RESOURCES_API_ROUTE } from "@/constants/apiRoutes";

import Syllabus from "./subs/Syllabus";

const TeacherDashboard = ({ slug }) => {
  // -----------------------------------
  // Fetch teaching resources data
  // -----------------------------------
  const [teachingResources, setTeachingResources] = useState(null);
  const [
    sendFetchTeachingResourcesRequest,
    setSendFetchTeachingResourcesRequest,
  ] = useState(false);
  const {
    status: fetchTeachingResourcesStatus,
    data: teachingResourcesApiData,
  } = useApiCalls({
    sendReq: sendFetchTeachingResourcesRequest,
    setSendReq: setSendFetchTeachingResourcesRequest,
    method: "GET",
    url: `${COURSE_TEACHING_RESOURCES_API_ROUTE}${slug}/`,
    showLoading: true,
    showErrerMessage: true,
  });
  useEffect(() => {
    if (teachingResourcesApiData?.id) {
      setTeachingResources(teachingResourcesApiData);
    }
  }, [teachingResourcesApiData]);
  useEffect(() => {
    setSendFetchTeachingResourcesRequest(true);
  }, []);

  useEffect(() => {
    console.log("teachingResources:", teachingResources);
  }, [teachingResources]);
  // -----------------------------------
  // -----------------------------------
  return (
    <>
      <AppSectionContainer hasBorder title="Course Syllabus">
        <Syllabus teachingResources={teachingResources} />
      </AppSectionContainer>
    </>
  );
};

export default TeacherDashboard;
