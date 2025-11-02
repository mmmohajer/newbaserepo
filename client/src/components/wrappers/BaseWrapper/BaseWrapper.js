import { useEffect } from "react";
import { useDispatch } from "react-redux";

import Div from "@/baseComponents/reusableComponents/Div";

import { getCartItems } from "@/utils/shppingCard";
import { setCart } from "@/reducer/subs/shoppingCart";

const BaseWrapper = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const cartItems = getCartItems();
    dispatch(setCart(cartItems));
  }, []);
  return <></>;
};

export default BaseWrapper;
