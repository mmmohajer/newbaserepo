import { useState, useEffect } from "react";
import cx from "classnames";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

import Div from "@/baseComponents/reusableComponents/Div";
import Card from "@/baseComponents/reusableComponents/Card";
import Icon from "@/baseComponents/reusableComponents/Icon";
import Button from "@/baseComponents/reusableComponents/Button";
import GetPaymentMethod from "@/baseComponents/stripe/GetPaymentMethod";
import Anchor from "@/baseComponents/reusableComponents/Anchor";

import useApiCalls from "@/hooks/useApiCalls";
import {
  CUSTOMER_PAYMENT_METHOD_API_ROUTE,
  CUSTOMER_CREATE_SETUP_INTENT_API_ROUTE,
} from "@/constants/apiRoutes";
import { addNewAlertItem } from "@/utils/alert";
import { COLORS } from "@/constants/vars";
import { PAGE_ROUTES } from "@/constants/pageRoutes";
import { clearModal } from "@/reducer/subs/modal";

const PaymentMethods = ({
  setupIntent,
  showNotifGoToBillingSection = false,
  setHasPaymentMethods = null,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [addNewPaymentIsHovered, setAddNewPaymentIsHovered] = useState(false);

  // -----------------------------------
  // Fetch all payment methods for the customer
  // -----------------------------------
  const [allPaymentMethods, setAllPaymentMethods] = useState([]);
  const [
    sendFetchAllPaymentMethodsRequest,
    setSendFetchAllPaymentMethodsRequest,
  ] = useState(false);
  const { status: fetchAllPaymentMethodsStatus, data: allPaymentMethodsData } =
    useApiCalls({
      sendReq: sendFetchAllPaymentMethodsRequest,
      setSendReq: setSendFetchAllPaymentMethodsRequest,
      method: "GET",
      url: CUSTOMER_PAYMENT_METHOD_API_ROUTE,
      showLoading: true,
      showErrerMessage: false,
    });
  useEffect(() => {
    if (allPaymentMethodsData?.length) {
      setAllPaymentMethods(allPaymentMethodsData);
      if (setHasPaymentMethods) setHasPaymentMethods(true);
    }
  }, [allPaymentMethodsData]);
  useEffect(() => {
    setSendFetchAllPaymentMethodsRequest(true);
  }, []);

  // -----------------------------------
  // Fetch and update payment method when setupIntent changes
  // -----------------------------------
  const [
    sendFetchCustomerPaymentMethodRequest,
    setSendFetchCustomerPaymentMethodRequest,
  ] = useState(false);
  const { status, data } = useApiCalls({
    sendReq: sendFetchCustomerPaymentMethodRequest,
    setSendReq: setSendFetchCustomerPaymentMethodRequest,
    method: "POST",
    url: CUSTOMER_PAYMENT_METHOD_API_ROUTE,
    bodyData: { setup_intent: setupIntent },
    showLoading: true,
    showErrerMessage: false,
  });
  useEffect(() => {
    if (data?.success) {
      setSendFetchAllPaymentMethodsRequest(true);
      addNewAlertItem(
        dispatch,
        "success",
        "Your payment method has been updated successfully!"
      );
    }
  }, [data]);
  useEffect(() => {
    if (setupIntent) {
      setSendFetchCustomerPaymentMethodRequest(true);
    }
  }, [setupIntent]);

  // -----------------------------------
  // Create setup intent and get client secret
  // -----------------------------------
  const [clientSecret, setClientSecret] = useState("");
  const [sendCreateSetupIntentRequest, setSendCreateSetupIntentRequest] =
    useState(false);
  const { status: createSetupIntentStatus, data: createSetupIntentData } =
    useApiCalls({
      sendReq: sendCreateSetupIntentRequest,
      setSendReq: setSendCreateSetupIntentRequest,
      method: "POST",
      url: CUSTOMER_CREATE_SETUP_INTENT_API_ROUTE,
      showLoading: true,
      showErrerMessage: true,
    });
  useEffect(() => {
    if (createSetupIntentData?.client_secret) {
      setClientSecret(createSetupIntentData.client_secret);
    }
  }, [createSetupIntentData]);
  // -----------------------------------
  return (
    <>
      {allPaymentMethods?.length && !showNotifGoToBillingSection ? (
        <Div className={cx("width-per-100")}>
          <Div
            type="flex"
            hAlign="start"
            className={cx("width-per-100 gap-16 flex--wrap")}
          >
            {allPaymentMethods?.map((item, idx) => (
              <Div
                key={idx}
                className={cx(
                  "width-per-100 max-width-px-350 min-width-px-300"
                )}
              >
                <Card
                  cardType={"credit-card"}
                  last4={item?.last4}
                  brand={item?.brand}
                  expMonth={item?.exp_month}
                  expYear={item?.exp_year}
                  isDefault={item?.is_default}
                  itemId={item?.payment_method_id}
                  onCallbackAfterUpdate={() =>
                    setSendFetchAllPaymentMethodsRequest(true)
                  }
                />
              </Div>
            ))}
          </Div>
          {!clientSecret ? (
            <Div type="flex" hAlign="end" className="m-t-32">
              <Div
                type="flex"
                vAlign="center"
                className="mouse-hand"
                onMouseEnter={() => setAddNewPaymentIsHovered(true)}
                onMouseLeave={() => setAddNewPaymentIsHovered(false)}
                onClick={() => setSendCreateSetupIntentRequest(true)}
              >
                <Div
                  type="flex"
                  hAlign="center"
                  vAlign="center"
                  className="width-px-25 height-px-25 m-r-4"
                >
                  <Icon
                    type="circle-plus"
                    scale={1.3}
                    color={
                      !addNewPaymentIsHovered ? COLORS?.["theme-two"] : "blue"
                    }
                  />
                </Div>
                <Div
                  className={cx(
                    "text-underline text-theme-two text-blue-on-hover"
                  )}
                >
                  Add a New Payment Method
                </Div>
              </Div>
            </Div>
          ) : (
            <GetPaymentMethod clientSecret={clientSecret} />
          )}
        </Div>
      ) : null}

      {allPaymentMethods?.length && showNotifGoToBillingSection ? (
        <Div className="f-s-px-14 text-center text-black">
          Your default payment method will be used for this transaction. If you
          want to add or update your payment methods, please go to the{" "}
          <span
            className="text-underline text-blue mouse-hand"
            onClick={() => {
              router.push(PAGE_ROUTES.APP.BILLING);
              dispatch(clearModal());
            }}
          >
            billing page
          </span>
          .
        </Div>
      ) : null}

      {!allPaymentMethods?.length && !showNotifGoToBillingSection ? (
        !clientSecret ? (
          <Div
            type="flex"
            hAlign="center"
            vAlign="center"
            className={cx("width-per-100 p-all-32")}
          >
            <Button
              btnText="Add a New Payment Method"
              onClick={() => setSendCreateSetupIntentRequest(true)}
            />
          </Div>
        ) : (
          <GetPaymentMethod clientSecret={clientSecret} />
        )
      ) : null}

      {!allPaymentMethods?.length && showNotifGoToBillingSection ? (
        <Div className="f-s-px-14 text-center text-black">
          In order to add a new payment method, you need to go to the{" "}
          <span
            className="text-underline text-blue mouse-hand"
            onClick={() => {
              router.push(PAGE_ROUTES.APP.BILLING);
              dispatch(clearModal());
            }}
          >
            billing page
          </span>
          .
        </Div>
      ) : null}
    </>
  );
};

export default PaymentMethods;
