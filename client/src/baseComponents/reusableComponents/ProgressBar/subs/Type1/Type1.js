import Div from "@/baseComponents/reusableComponents/Div";

const Type1 = ({ percentage = 0 }) => {
  return (
    <>
      <Div type="flex" hAlign="end">
        {percentage}%
      </Div>
      <Div className="width-per-100 height-px-20 width-per-100 br-rad-px-10 of-hidden bg-white br-all-solid-2 br-theme-two">
        <Div
          style={{ width: `${percentage}%` }}
          className="height-per-100 bg-theme-two global-transition-one"
        />
      </Div>
    </>
  );
};

export default Type1;
