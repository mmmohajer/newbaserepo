import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  clearCart as clearCartAction,
} from "@/reducer/subs/shoppingCart";
import { setModal } from "@/reducer/subs/modal";
import {
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
} from "./storage";
import { PAGE_ROUTES } from "@/constants/pageRoutes";

const SHOPPING_CART_KEY = "shopping_cart";

export const addToCart = (dispatch, router, item, productType = "course") => {
  dispatch(addToCartAction({ ...item, productType }));
  const cart = getLocalStorage(SHOPPING_CART_KEY) || [];
  cart.push({ ...item, productType });
  setLocalStorage(SHOPPING_CART_KEY, cart);
  dispatch(
    setModal({
      type: "prompt-message",
      props: {
        message:
          "🎉 Item added to cart successfully! Ready to checkout or continue shopping?",
        confirmBtnText: "Proceed to Checkout",
        confirmBtnAction: () => {
          router.push(PAGE_ROUTES.APP.SHOPPING_CART);
        },
        cancelBtnText: "Continue Shopping",
        // cancelBtnAction: () => {
        //   console.log("Cancel button clicked!");
        //   alert("Cancelled!");
        // },
      },
    })
  );
};

export const removeFromCart = (dispatch, itemId) => {
  dispatch(removeFromCartAction({ id: itemId }));
  const cart = getLocalStorage(SHOPPING_CART_KEY) || [];
  const updatedCart = cart.filter((item) => item.id !== itemId);
  setLocalStorage(SHOPPING_CART_KEY, updatedCart);
};

export const getCartItems = () => {
  return getLocalStorage(SHOPPING_CART_KEY) || [];
};

export const clearCart = (dispatch) => {
  dispatch(clearCartAction());
  removeLocalStorage(SHOPPING_CART_KEY);
};
