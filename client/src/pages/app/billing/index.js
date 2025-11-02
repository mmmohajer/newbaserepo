import { useRouter } from "next/router";

import Seo from "@/components/wrappers/Seo";
import AppContainer from "@/components/wrappers/AppContainer";
import RoleBasedRoute from "@/components/wrappers/RoleBasedRoute";
import Billing from "@/components/appPages/Billing";

const Index = () => {
  const router = useRouter();

  const { setup_intent } = router.query;

  return (
    <Seo
      title="Tech Tips by Moh | Billing"
      url="https://tipsbymoh.tech/app/billing"
    >
      <AppContainer
        pageIdentifier="billing"
        hasSideBarDashboard={true}
        hasHeader={true}
      >
        <RoleBasedRoute authorizedRoles={["CLIENT"]}>
          <Billing setupIntent={setup_intent} />
        </RoleBasedRoute>
      </AppContainer>
    </Seo>
  );
};

export default Index;
