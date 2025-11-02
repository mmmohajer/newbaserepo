import Div from "@/baseComponents/reusableComponents/Div";

import CreditCard from "./subs/CreditCard";
import ShoppingItem from "./subs/ShoppingItem";

const DisplayCards = () => {
  return (
    <>
      <Div className="m-all-16">
        <CreditCard />
      </Div>
      <Div className="m-all-16">
        <ShoppingItem />
      </Div>
    </>
  );
};

export default DisplayCards;
