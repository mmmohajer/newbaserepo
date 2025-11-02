import Div from "@/baseComponents/reusableComponents/Div";

import PromptMessage from "./subs/PromptMessage";
import CheckoutProducts from "./subs/CheckoutProducts";

const DisplayModal = () => {
  return (
    <>
      <Div type="flex" direction="vertical" className="p-all-16">
        <PromptMessage />
        <CheckoutProducts />
      </Div>
    </>
  );
};

export default DisplayModal;
