import { useState } from "react";

import Div from "@/baseComponents/reusableComponents/Div";
import AppSectionContainer from "@/components/wrappers/AppSectionContainer";

import BillingInfo from "./subs/BillingInfo";
import PaymentMethods from "@/baseComponents/stripe/PaymentMethods";

const Billing = ({ setupIntent }) => {
  const [hasBillingInfo, setHasBillingInfo] = useState(false);

  return (
    <>
      <AppSectionContainer title="Billing Information" hasBorder>
        <BillingInfo setHasBillingInfo={setHasBillingInfo} />
      </AppSectionContainer>
      {hasBillingInfo ? (
        <AppSectionContainer title="Payment Methods" hasBorder>
          <PaymentMethods setupIntent={setupIntent} />
        </AppSectionContainer>
      ) : null}
    </>
  );
};

export default Billing;
