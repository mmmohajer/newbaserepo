import { useRouter } from "next/router";

import Seo from "@/components/wrappers/Seo";
import AppContainer from "@/components/wrappers/AppContainer";
import RoleBasedRoute from "@/components/wrappers/RoleBasedRoute";
import Settings from "@/components/appPages/Settings";

const Index = () => {
  return (
    <Seo
      title="Tech Tips by Moh | Settings"
      url="https://tipsbymoh.tech/app/settings"
    >
      <AppContainer
        pageIdentifier="settings"
        hasSideBarDashboard={true}
        hasHeader={true}
      >
        <RoleBasedRoute authorizedRoles={["CLIENT"]}>
          <Settings />
        </RoleBasedRoute>
      </AppContainer>
    </Seo>
  );
};

export default Index;
