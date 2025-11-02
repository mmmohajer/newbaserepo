import Seo from "@/components/wrappers/Seo";
import AppContainer from "@/components/wrappers/AppContainer";
import RoleBasedRoute from "@/components/wrappers/RoleBasedRoute";
import ShoppingCart from "@/components/appPages/ShoppingCart";

const Index = () => {
  return (
    <Seo
      title="Tech Tips by Moh | Shopping Cart"
      url="https://tipsbymoh.tech/app/shopping-cart"
    >
      <AppContainer
        pageIdentifier="shopping-cart"
        hasSideBarDashboard={true}
        hasHeader={true}
      >
        <RoleBasedRoute authorizedRoles={["CLIENT"]}>
          <ShoppingCart />
        </RoleBasedRoute>
      </AppContainer>
    </Seo>
  );
};

export default Index;
