import Div from "@/baseComponents/reusableComponents/Div";

import CreditCard from "./subs/CreditCard";
import ShoppingItem from "./subs/ShoppingItem";

const Card = ({ cardType, ...props }) => {
  return (
    <>
      {cardType === "credit-card" ? <CreditCard {...props} /> : ""}
      {cardType === "shopping-item" ? <ShoppingItem {...props} /> : ""}
    </>
  );
};

export default Card;
