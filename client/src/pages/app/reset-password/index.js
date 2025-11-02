import { useSearchParams } from "next/navigation";

import Seo from "@/components/wrappers/Seo";
import AppContainer from "@/components/wrappers/AppContainer";
import ResetPassword from "@/components/appPages/ResetPassword";

const Index = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  return (
    <Seo
      title="Tech Tips by Moh | Reset Your Password"
      url="https://tipsbymoh.tech/app/forgot-password"
    >
      <AppContainer
        isAuthPage={true}
        pageIdentifier="reset-password"
        hasHeader={false}
      >
        <ResetPassword token={token} email={email} />
      </AppContainer>
    </Seo>
  );
};

export default Index;
