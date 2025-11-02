import { useDispatch } from "react-redux";

import Button from "@/baseComponents/reusableComponents/Button";

import { setModal } from "@/reducer/subs/modal";

const PromptMessage = () => {
  const dispatch = useDispatch();

  return (
    <>
      <Button
        btnText="Modal of type prompt-message"
        className="width-px-350"
        onClick={() => {
          dispatch(
            setModal({
              type: "prompt-message",
              props: {
                message:
                  "This is a sample message with confirm and cancel actions",
                confirmBtnText: "Confirm",
                confirmBtnAction: () => {
                  console.log("Confirm button clicked!");
                  alert("Confirmed!");
                },
                cancelBtnText: "Cancel",
                cancelBtnAction: () => {
                  console.log("Cancel button clicked!");
                  alert("Cancelled!");
                },
              },
            })
          );
        }}
      />
    </>
  );
};

export default PromptMessage;
