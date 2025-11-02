import Seo from "@/components/wrappers/Seo";
import PageContainer from "@/components/wrappers/PageContainer";
import AppContainer from "@/components/wrappers/AppContainer";
import RoleBasedRoute from "@/components/wrappers/RoleBasedRoute";
import TestComponent from "@/components/adminPages/TestComponent";

const Index = () => {
  return (
    <>
      <Seo
        hidden_to_search_engines={true}
        title="Tech Tips by Moh | Test Page"
        url="https://tipsbymoh.tech/admin/test-page"
      >
        <AppContainer pageIdentifier="admin-test-page">
          <RoleBasedRoute authorizedRoles={["ADMIN"]}>
            <TestComponent />
          </RoleBasedRoute>
        </AppContainer>
      </Seo>
    </>
  );
};

export default Index;
