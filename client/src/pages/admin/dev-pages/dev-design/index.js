import Seo from "@/components/wrappers/Seo";
import PageContainer from "@/components/wrappers/PageContainer";
import AppContainer from "@/components/wrappers/AppContainer";
import RoleBasedRoute from "@/components/wrappers/RoleBasedRoute";
import DevDesign from "@/components/adminPages/DevPages/DevDesign";

const Index = () => {
  return (
    <>
      <Seo
        hidden_to_search_engines={true}
        title="Tech Tips by Moh | Dev Design Page"
        url="https://tipsbymoh.tech/admin/dev-pages/dev-design"
      >
        <AppContainer
          pageIdentifier="dev-page"
          hasSideBarDashboard={false}
          hasHeader={false}
        >
          <RoleBasedRoute authorizedRoles={["ADMIN"]}>
            <DevDesign />
          </RoleBasedRoute>
        </AppContainer>
      </Seo>
    </>
  );
};

export default Index;
