import { useSearchParams } from "next/navigation";

import Seo from "@/components/wrappers/Seo";
import AppContainer from "@/components/wrappers/AppContainer";
import AuthWithGoogle from "@/components/appPages/AuthWithGoogle";

const Index = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  return (
    <Seo
      title="Tech Tips by Moh | Authenticate with Google"
      url="https://tipsbymoh.tech/app/activate-user"
    >
      <AppContainer
        isAuthPage={true}
        pageIdentifier="auth-with-google"
        hasHeader={false}
      >
        <AuthWithGoogle code={code} />
      </AppContainer>
    </Seo>
  );
};

export default Index;
