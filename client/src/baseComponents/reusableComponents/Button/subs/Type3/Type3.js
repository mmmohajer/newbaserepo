import cx from "classnames";
import Div from "@/baseComponents/reusableComponents/Div";

const Type3 = ({ btnText, className, ...props }) => {
  return (
    <>
      <button
        className={cx(
          "p-y-8 p-x-16 br-rad-px-50 mouse-hand bg-silver br-all-solid-2 br-black bg-theme-three-on-hover",
          className
        )}
        {...props}
      >
        {btnText}
      </button>
    </>
  );
};

export default Type3;
