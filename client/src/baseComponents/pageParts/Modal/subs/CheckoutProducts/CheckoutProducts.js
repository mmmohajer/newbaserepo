import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import Div from "@/baseComponents/reusableComponents/Div";
import Icon from "@/baseComponents/reusableComponents/Icon";
import Button from "@/baseComponents/reusableComponents/Button";
import PaymentMethods from "@/baseComponents/stripe/PaymentMethods";
import Paragraph from "@/baseComponents/reusableComponents/Paragraph";
import Anchor from "@/baseComponents/reusableComponents/Anchor";

import { PAGE_ROUTES } from "@/constants/pageRoutes";
import { clearModal } from "@/reducer/subs/modal";
import useApiCalls from "@/hooks/useApiCalls";
import { CUSTOMER_TRANSACTION_API_ROUTE } from "@/constants/apiRoutes";
import { addNewAlertItem } from "@/utils/alert";
import { getCartItems, clearCart } from "@/utils/shppingCard";

const CheckoutProducts = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { totalPrice, currencyMultiplierToStripeUnit, isInPublicWebPage } =
    useSelector((state) => state.modal.props);

  const [hasPaymentMethods, setHasPaymentMethods] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const cartItems = getCartItems();
    const localProducts = [];
    cartItems?.forEach((item) => {
      localProducts.push({ id: item.id, quantity: 1 });
    });
    setProducts([...localProducts]);
  }, []);

  // ------------------------------------------------
  // Create a transaction
  // ------------------------------------------------
  const [createTransaction, setCreateTransaction] = useState(false);
  const { status: createTransactionStatus, data: createTransactionData } =
    useApiCalls({
      method: "POST",
      url: CUSTOMER_TRANSACTION_API_ROUTE,
      bodyData: {
        products,
        total_amount: parseInt(totalPrice * currencyMultiplierToStripeUnit),
      },
      sendReq: createTransaction,
      setSendReq: setCreateTransaction,
      showLoading: true,
      showErrerMessage: true,
    });
  useEffect(() => {
    if (createTransactionData?.id) {
      dispatch(clearModal());
      clearCart(dispatch);
      addNewAlertItem(
        dispatch,
        "success",
        "Transaction completed successfully!"
      );
    }
  }, [createTransactionData]);

  return (
    <>
      <Div
        type="flex"
        hAlign="center"
        direction="vertical"
        className="text-black width-px-350 m-l-auto m-r-auto"
      >
        <Div className="f-b f-s-px-20 m-b-16">💡 Confirm Your Purchase</Div>
        <Div className="width-per-100 p-b-16 br-bottom-solid-5 br-theme-two m-b-16">
          <Div>
            Your items in the card will be purchased for the following price:
          </Div>

          <Div type="flex" hAlign="center" className="width-per-100 m-t-16">
            <Div className="f-b">${parseFloat(totalPrice).toFixed(2)}</Div>
          </Div>
        </Div>

        <Div className="width-per-100">
          {!isInPublicWebPage ? (
            <Div className="width-per-100">
              <Div type="flex" hAlign="start" vAlign="center">
                <Div
                  type="flex"
                  hAlign="center"
                  vAlign="center"
                  className="m-r-8 width-px-20 height-px-20"
                >
                  <Icon type="credit-card" />
                </Div>
                <Div className="f-b f-s-px-18">Payment Method</Div>
              </Div>
              <Div className="width-per-100 m-y-16">
                <PaymentMethods
                  showNotifGoToBillingSection={true}
                  setHasPaymentMethods={setHasPaymentMethods}
                />
              </Div>
            </Div>
          ) : null}

          {isInPublicWebPage ? (
            <Div className="width-per-100">
              <Div type="flex" hAlign="start" vAlign="center">
                <Div
                  type="flex"
                  hAlign="center"
                  vAlign="center"
                  className="m-r-8 width-px-20 height-px-20"
                >
                  <Icon type="credit-card" />
                </Div>
                <Div className="f-b f-s-px-18">Payment Method</Div>
              </Div>
              <Div className="width-per-100 m-y-16">
                <Paragraph>
                  {" "}
                  To complete your payment, please log in to your account first.
                </Paragraph>
                <Paragraph className="m-t-16">
                  If you already have an account, go to{" "}
                  <span
                    className="text-underline text-blue mouse-hand"
                    onClick={() => {
                      router.push(PAGE_ROUTES.APP.MENTORSHIP);
                      dispatch(clearModal());
                    }}
                  >
                    your mentorship
                  </span>{" "}
                  dashboard to finish the transaction. If you don’t have an
                  account yet, please visit the{" "}
                  <span
                    className="text-underline text-blue mouse-hand"
                    onClick={() => {
                      router.push(PAGE_ROUTES.APP.REGISTER);
                      dispatch(clearModal());
                    }}
                  >
                    sign-up page
                  </span>{" "}
                  to create one.
                </Paragraph>
              </Div>
            </Div>
          ) : null}

          {!isInPublicWebPage ? (
            <>
              <Div className="width-per-100 f-b m-b-8">Schedule later?</Div>
              <Div className="f-s-px-14 text-center">
                You can book your mentorship sessions after payment is
                confirmed.
              </Div>

              {hasPaymentMethods ? (
                <Div type="flex" hAlign="center" className="m-t-16">
                  <Div className="m-r-16">
                    <Button
                      btnType={3}
                      btnText="Cancel"
                      className="width-px-100"
                      onClick={() => dispatch(clearModal())}
                    />
                  </Div>
                  <Div>
                    <Button
                      btnText="Confirm and Pay"
                      className="width-px-200"
                      onClick={() => setCreateTransaction(true)}
                    />
                  </Div>
                </Div>
              ) : (
                <Div type="flex" hAlign="center" className="m-t-16">
                  <Button
                    btnText="Go to Billing Page"
                    onClick={() => {
                      router.push(PAGE_ROUTES.APP.BILLING);
                      dispatch(clearModal());
                    }}
                  />
                </Div>
              )}
            </>
          ) : null}

          {isInPublicWebPage ? (
            <Div type="flex" hAlign="center" className="m-t-16">
              <Button
                btnText="Go to your account"
                onClick={() => {
                  router.push(PAGE_ROUTES.APP.MENTORSHIP);
                  dispatch(clearModal());
                }}
              />
            </Div>
          ) : null}
        </Div>
      </Div>
    </>
  );
};

export default CheckoutProducts;
