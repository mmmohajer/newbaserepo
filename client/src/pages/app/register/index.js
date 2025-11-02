import Seo from "@/components/wrappers/Seo";
import AppContainer from "@/components/wrappers/AppContainer";
import Register from "@/components/appPages/Register";

const Index = () => {
  return (
    <Seo
      title="Tech Tips by Moh | Register"
      url="https://tipsbymoh.tech/app/register"
    >
      <AppContainer
        isAuthPage={true}
        pageIdentifier="register"
        hasHeader={false}
      >
        <Register />
      </AppContainer>
    </Seo>
  );
};

export default Index;
