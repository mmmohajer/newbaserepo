import { useState, useEffect } from "react";
import cx from "classnames";
import { useDispatch } from "react-redux";

import Div from "@/baseComponents/reusableComponents/Div";
import Icon from "@/baseComponents/reusableComponents/Icon";
import SVGIcon from "@/baseComponents/reusableComponents/SVGIcon";

import { COLORS } from "@/constants/vars";
import useApiCalls from "@/hooks/useApiCalls";
import { CUSTOMER_PAYMENT_METHOD_API_ROUTE } from "@/constants/apiRoutes";
import { addNewAlertItem } from "@/utils/alert";

import { LIST_OF_BRANDS_WITH_LOGO } from "./constants";

const CreditCardInfo = ({
  last4,
  brand,
  expMonth,
  expYear,
  isDefault,
  itemId,
  onCallbackAfterUpdate = null,
}) => {
  const dispatch = useDispatch();

  const selectIconType = (brand) => {
    if (brand === "visa") {
      return "visa";
    } else if (brand === "mastercard") {
      return "master-card";
    } else if (brand === "amex") {
      return "amex-card";
    } else if (brand === "diners") {
      return "diners-card";
    } else if (brand === "discover") {
      return "discover-card";
    } else if (brand === "jcb") {
      return "jcb-card";
    } else {
      return "credit-card";
    }
  };

  // -----------------------------------
  // Update Payment Method
  // -----------------------------------
  const [sendUpdatePaymentMethodRequest, setSendUpdatePaymentMethodRequest] =
    useState(false);
  const { status: updatePaymentMethodStatus, data: updatePaymentMethodData } =
    useApiCalls({
      method: "PUT",
      url: CUSTOMER_PAYMENT_METHOD_API_ROUTE,
      bodyData: { payment_method_id: itemId },
      sendReq: sendUpdatePaymentMethodRequest,
      setSendReq: setSendUpdatePaymentMethodRequest,
      showLoading: true,
      showErrerMessage: true,
    });
  useEffect(() => {
    if (updatePaymentMethodData?.success) {
      if (onCallbackAfterUpdate) onCallbackAfterUpdate();
      addNewAlertItem(
        dispatch,
        "success",
        "Default payment method updated successfully."
      );
    }
  }, [updatePaymentMethodData]);

  // -----------------------------------
  // Delete Payment Method
  // -----------------------------------
  const [sendDeletePaymentMethodRequest, setSendDeletePaymentMethodRequest] =
    useState(false);
  const { status: deletePaymentMethodStatus, data: deletePaymentMethodData } =
    useApiCalls({
      method: "DELETE",
      url: `${CUSTOMER_PAYMENT_METHOD_API_ROUTE}?payment_method_id=${itemId}`,
      sendReq: sendDeletePaymentMethodRequest,
      setSendReq: setSendDeletePaymentMethodRequest,
      showLoading: true,
      showErrerMessage: true,
    });
  useEffect(() => {
    if (deletePaymentMethodData?.success) {
      if (onCallbackAfterUpdate) onCallbackAfterUpdate();
      addNewAlertItem(
        dispatch,
        "success",
        "Payment method deleted successfully."
      );
    }
  }, [deletePaymentMethodData]);
  // -----------------------------------
  return (
    <>
      <Div
        type="flex"
        direction="vertical"
        vAlign="center"
        className={cx(
          "text-black width-per-100 br-rad-px-15 p-all-16 f-s-px-14",

          isDefault
            ? "bg-theme-three br-all-solid-2 br-theme-one"
            : "bg-white br-all-solid-2 br-theme-one"
        )}
      >
        <Div type="flex">
          <Div
            type="flex"
            hAlign="center"
            vAlign="center"
            className="width-px-40 height-px-30"
          >
            {LIST_OF_BRANDS_WITH_LOGO?.includes(brand) ? (
              <SVGIcon type={selectIconType(brand)} />
            ) : (
              <Icon
                type={"credit-card"}
                scale={2}
                color={COLORS["theme-two"]}
              />
            )}
          </Div>
          <Div className="text-black global-text-title f-s-px-18 f-b m-l-8">
            {LIST_OF_BRANDS_WITH_LOGO?.includes(brand) ? brand : "Credit Card"}
          </Div>
        </Div>
        <Div className="m-l-40">
          <Div className="text-black">{"**** **** **** " + last4}</Div>
          <Div>{`Expiry on ${expMonth}/${expYear}`}</Div>
          <Div type="flex" distributedBetween>
            {" "}
            {isDefault ? (
              <Div type="flex" vAlign="center">
                <Div
                  type="flex"
                  className="width-px-20 heght-px-20"
                  vAlign="center"
                  hAlign="center"
                >
                  <Icon type="check-mark" color={COLORS?.["theme-two"]} />
                </Div>
                <Div className="f-s-px-12 text-theme-two f-b m-l-5">
                  Default payment method
                </Div>
              </Div>
            ) : (
              <Div
                className="text-black mouse-hand"
                style={{ textDecoration: "underline" }}
                onClick={() => setSendUpdatePaymentMethodRequest(true)}
              >
                Set as Default
              </Div>
            )}
            <Div
              type="flex"
              hAlign="center"
              vAlign="center"
              className="mouse-hand width-px-30 height-px-30"
              onClick={() => setSendDeletePaymentMethodRequest(true)}
            >
              <Icon type="trash" scale={1.5} color={"red"} />
            </Div>
          </Div>
        </Div>
      </Div>
    </>
  );
};

export default CreditCardInfo;
