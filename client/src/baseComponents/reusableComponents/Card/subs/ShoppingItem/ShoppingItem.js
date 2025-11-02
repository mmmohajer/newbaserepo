import Div from "@/baseComponents/reusableComponents/Div";

import Course from "./subs/Course";

const ShoppingItem = ({ productType, ...props }) => {
  return (
    <>
      {productType === "course" && <Course {...props} />}
      {/* Other types go here */}
    </>
  );
};

export default ShoppingItem;
