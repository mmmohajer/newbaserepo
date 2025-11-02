import { useSearchParams } from "next/navigation";

import Seo from "@/components/wrappers/Seo";
import AppContainer from "@/components/wrappers/AppContainer";
import RoleBasedRoute from "@/components/wrappers/RoleBasedRoute";
import Dashboard from "@/components/appPages/Dashboard";

const Index = () => {
  return (
    <Seo
      title="PAGE_TITLE"
      keywords="PAGE_KEYWORDS"
      description="PAGE_DESCRIPTION"
      imagePreview="PAGE_IMAGE_PREVIEW"
      url="PAGE_URL"
      imgAlt="PAGE_IMAGE_ALT"
    >
      <AppContainer
        pageIdentifier="dashboard"
        hasSideBarDashboard={true}
        hasHeader={true}
      >
        <RoleBasedRoute authorizedRoles={["CLIENT", "ADMIN"]}>
          <Dashboard />
        </RoleBasedRoute>
      </AppContainer>
    </Seo>
  );
};

export default Index;
