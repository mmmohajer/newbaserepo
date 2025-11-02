import cx from "classnames";
import Div from "@/baseComponents/reusableComponents/Div";

import Type1 from "./subs/Type1";
import Type2 from "./subs/Type2";
import Type3 from "./subs/Type3";

const Button = ({ btnType = 1, ...props }) => {
  return (
    <>
      {btnType === 1 ? <Type1 {...props} /> : null}
      {btnType === 2 ? <Type2 {...props} /> : null}
      {btnType === 3 ? <Type3 {...props} /> : null}
    </>
  );
};

export default Button;
