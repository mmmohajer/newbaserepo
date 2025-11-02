import Div from "@/baseComponents/reusableComponents/Div";

import Type1 from "./subs/Type1";

const ProgressBar = ({ type = 1, ...props }) => {
  return (
    <>
      {type === 1 && <Type1 {...props} />}
      {/* Add more types as needed */}
    </>
  );
};

export default ProgressBar;
