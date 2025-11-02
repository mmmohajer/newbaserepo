import Div from "@/baseComponents/reusableComponents/Div";
import AppSectionContainer from "@/components/wrappers/AppSectionContainer";

import Overview from "./subs/Overview";

const ClientDashboard = () => {
  return (
    <>
      <AppSectionContainer title="Overview" hasBorder>
        <Overview />
      </AppSectionContainer>
    </>
  );
};

export default ClientDashboard;
