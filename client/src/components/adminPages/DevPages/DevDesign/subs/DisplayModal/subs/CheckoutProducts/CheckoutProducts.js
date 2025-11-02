import { useDispatch } from "react-redux";

import Button from "@/baseComponents/reusableComponents/Button";

import { setModal } from "@/reducer/subs/modal";

const CheckoutProducts = () => {
  const dispatch = useDispatch();

  return (
    <>
      <Button
        btnText="Modal of type checkout-products"
        className="width-px-350"
        onClick={() => {
          dispatch(
            setModal({
              type: "checkout-products",
              props: {
                totalPrice: 9.99,
                currencyMultiplierToStripeUnit: 100,
                isInPublicWebPage: false,
              },
            })
          );
        }}
      />
    </>
  );
};

export default CheckoutProducts;
