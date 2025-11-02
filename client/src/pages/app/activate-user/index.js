import { useSearchParams } from "next/navigation";

import Seo from "@/components/wrappers/Seo";
import AppContainer from "@/components/wrappers/AppContainer";
import ActivateUser from "@/components/appPages/ActivateUser";

const Index = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const redirectUrl = searchParams.get("redirect_url");

  return (
    <Seo
      title="Tech Tips by Moh | Activate User Account"
      url="https://tipsbymoh.tech/app/activate-user"
    >
      <AppContainer
        isAuthPage={true}
        pageIdentifier="activate-user"
        hasHeader={false}
      >
        <ActivateUser token={token} redirectUrl={redirectUrl} />
      </AppContainer>
    </Seo>
  );
};

export default Index;
