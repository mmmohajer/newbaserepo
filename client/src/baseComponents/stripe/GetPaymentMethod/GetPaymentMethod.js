import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import Div from "@/baseComponents/reusableComponents/Div";
import { STRIPE_PUBLISHABLE_KEY } from "config";

import GetPaymentMethodForm from "./subs/GetPaymentMethodForm";

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const GetPaymentMethod = ({ clientSecret }) => {
  const options = {
    clientSecret,
    appearance: { theme: "stripe" },
    fields: {
      billingDetails: {
        address: {
          country: "never",
          postalCode: "never",
          // You can control other address fields similarly:
          // line1: "never",
          // line2: "never",
          // city: "never",
          // state: "never",
        },
      },
    },
  };

  return (
    <>
      <Elements stripe={stripePromise} options={options}>
        <GetPaymentMethodForm clientSecret={clientSecret} />
      </Elements>
    </>
  );
};

export default GetPaymentMethod;
