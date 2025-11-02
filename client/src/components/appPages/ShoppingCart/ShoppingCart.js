import Div from "@/baseComponents/reusableComponents/Div";
import AppSectionContainer from "@/components/wrappers/AppSectionContainer";

import ShowItems from "./subs/ShowItems";

const ShoppingCart = () => {
  return (
    <AppSectionContainer title="Cart Items" hasBorder hasFullHeight>
      <ShowItems />
    </AppSectionContainer>
  );
};

export default ShoppingCart;
