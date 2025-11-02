import { useDispatch, useSelector } from "react-redux";

import Div from "@/baseComponents/reusableComponents/Div";
import Button from "@/baseComponents/reusableComponents/Button";

import { clearModal } from "@/reducer/subs/modal";

const PromptMessage = () => {
  const dispatch = useDispatch();
  const {
    message,
    confirmBtnText,
    confirmBtnAction,
    cancelBtnText,
    cancelBtnAction,
  } = useSelector((state) => state.modal.props);

  return (
    <>
      <Div className="m-b-temp-8">{message}</Div>
      <Div type="flex" className="flex--wrap gap-16">
        <Div>
          <Button
            btnText={confirmBtnText || "Confirm"}
            className={"min-width-px-200"}
            onClick={() => {
              if (confirmBtnAction) {
                confirmBtnAction();
              }
              dispatch(clearModal());
            }}
          />
        </Div>
        {cancelBtnText?.length ? (
          <Div>
            <Button
              btnText={cancelBtnText || "Cancel"}
              btnType={3}
              className={"min-width-px-100"}
              onClick={() => {
                if (cancelBtnAction) {
                  cancelBtnAction();
                }
                dispatch(clearModal());
              }}
            />
          </Div>
        ) : null}
      </Div>
    </>
  );
};

export default PromptMessage;
