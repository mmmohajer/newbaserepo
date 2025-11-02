import { useState, useEffect } from "react";
import cx from "classnames";
import { useDispatch, useSelector } from "react-redux";

import Div from "@/baseComponents/reusableComponents/Div";
import Button from "@/baseComponents/reusableComponents/Button";
import Card from "@/baseComponents/reusableComponents/Card";

import { setModal } from "@/reducer/subs/modal";
import { getCartItems } from "@/utils/shppingCard";

import styles from "./ShowItems.module.scss";

const ShowItems = () => {
  const dispatch = useDispatch();
  const shoppingCart = useSelector((state) => state.shoppingCart);

  const [totalPrice, setTotalPrice] = useState(0);
  const [currencyMultiplierToStripeUnit, setCurrencyMultiplierToStripeUnit] =
    useState(100);
  useEffect(() => {
    let amount = 0;
    const cartItems = getCartItems();
    cartItems?.forEach((item) => {
      amount += parseFloat(item.price);
    });
    setCurrencyMultiplierToStripeUnit(
      cartItems?.[0]?.currency_multiplier_to_stripe_unit || 100
    );
    setTotalPrice(amount);
  }, [shoppingCart]);

  return (
    <>
      {totalPrice > 0 ? (
        <Div
          className={cx("width-per-100 gap-32 of-hidden", styles.container)}
          type="flex"
          direction="vertical"
        >
          <Div
            type="flex"
            distributedBetween
            vAlign="center"
            className="flex--shrink--0 width-per-100 flex--wrap gap-16"
          >
            <Div className="flex--grow--1">
              <Button
                btnText="Checkout"
                className="width-per-100 max-width-px-300"
                onClick={() => {
                  dispatch(
                    setModal({
                      type: "checkout-products",
                      props: {
                        totalPrice,
                        currencyMultiplierToStripeUnit,
                        isInPublicWebPage: false,
                      },
                    })
                  );
                }}
              />
            </Div>
            <Div>
              <Div className="bg-theme-six flex--shrink--0 text-theme-one p-all-16 br-rad-px-10">
                Total: $
                {shoppingCart.reduce(
                  (acc, item) => acc + parseFloat(item.price),
                  0
                )}
              </Div>
            </Div>
          </Div>
          <Div
            className="flex--grow--1 of-y-auto scroll-type-one"
            type="flex"
            direction="vertical"
          >
            <Div type="flex" className="gap-16 flex--wrap">
              {shoppingCart?.map((item, idx) => (
                <Div
                  type="flex"
                  key={idx}
                  className="width-per-100 max-width-px-300 bg-theme-three br-rad-px-10"
                >
                  <Card
                    cardType="shopping-item"
                    courseItem={item}
                    productType={item?.productType}
                  />
                </Div>
              ))}
            </Div>
          </Div>
        </Div>
      ) : (
        <Div
          type="flex"
          hAlign="center"
          vAlign="center"
          className={cx("width-per-100 gap-32 of-hidden", styles.container)}
          direction="vertical"
        >
          <Div className="text-theme-two f-b f-s-px-20">No items in cart</Div>
        </Div>
      )}
    </>
  );
};

export default ShowItems;
