import { useDispatch } from "react-redux";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import Div from "@/baseComponents/reusableComponents/Div";
import Form from "@/baseComponents/formComponents/Form";
import Button from "@/baseComponents/reusableComponents/Button";

import { addNewAlertItem } from "@/utils/alert";
import { PAGE_ROUTES } from "@/constants/pageRoutes";
import { APP_DOMAIN_FOR_CLIENT_SIDE } from "config";

const GetPaymentMethodForm = ({ clientSecret }) => {
  const dispatch = useDispatch();

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      addNewAlertItem(dispatch, "error", "Stripe has not loaded yet.");
      return;
    }

    const { error: submitError } = await elements.submit();
    if (submitError) {
      console.log("Error submitting payment details:", submitError);
      addNewAlertItem(dispatch, "error", submitError.message);
      return;
    }

    const { error, setupIntent } = await stripe.confirmSetup({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${APP_DOMAIN_FOR_CLIENT_SIDE}${PAGE_ROUTES.APP.BILLING}`,
      },
    });

    if (error) {
      console.log("Error confirming setup:", error);
      addNewAlertItem(dispatch, "error", error.message);
    } else if (setupIntent && setupIntent.status === "succeeded") {
      addNewAlertItem(
        dispatch,
        "success",
        "Your card has been saved successfully!"
      );
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <PaymentElement />
        <Div className="m-t-16">
          <Button type="submit" btnText="Save Card" className="width-px-300" />
        </Div>
      </Form>
    </>
  );
};

export default GetPaymentMethodForm;
