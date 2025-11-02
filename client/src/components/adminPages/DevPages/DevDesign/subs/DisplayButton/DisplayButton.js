import Div from "@/baseComponents/reusableComponents/Div";
import Button from "@/baseComponents/reusableComponents/Button";

const DisplayButton = () => {
  return (
    <>
      <Div>
        <Button btnText="Button Type 1" className="width-px-200" />
      </Div>
      <Div>
        <Button btnText="Button Type 2" btnType={2} className="width-px-200" />
      </Div>
      <Div>
        <Button btnText="Button Type 3" btnType={3} className="width-px-200" />
      </Div>
    </>
  );
};

export default DisplayButton;
