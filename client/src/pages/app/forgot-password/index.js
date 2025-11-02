import Seo from "@/components/wrappers/Seo";
import AppContainer from "@/components/wrappers/AppContainer";
import ForgotPassword from "@/components/appPages/ForgotPassword";

const Index = () => {
  return (
    <Seo
      title="Tech Tips by Moh | Forgot Your Password"
      url="https://tipsbymoh.tech/app/forgot-password"
    >
      <AppContainer
        isAuthPage={true}
        pageIdentifier="forgot-password"
        hasHeader={false}
      >
        <ForgotPassword />
      </AppContainer>
    </Seo>
  );
};

export default Index;
