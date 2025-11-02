import Seo from "@/components/wrappers/Seo";
import AppContainer from "@/components/wrappers/AppContainer";
import Login from "@/components/appPages/Login";

const Index = () => {
  return (
    <Seo
      title="Tech Tips by Moh | Login"
      url="https://tipsbymoh.tech/app/login"
    >
      <AppContainer isAuthPage={true} pageIdentifier="login" hasHeader={false}>
        <Login />
      </AppContainer>
    </Seo>
  );
};

export default Index;
