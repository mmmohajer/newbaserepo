import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import Div from "@/baseComponents/reusableComponents/Div";
import Heading from "@/baseComponents/reusableComponents/Heading";
import TextBox from "@/baseComponents/formComponents/TextBox";
import Form from "@/baseComponents/formComponents/Form";
import Button from "@/baseComponents/reusableComponents/Button";
import Anchor from "@/baseComponents/reusableComponents/Anchor";

import LoginRegisterTemplate from "../shared/LoginRegisterTemplate";

import useApiCalls from "@/hooks/useApiCalls";
import { USER_FORGOT_PASSWORD_API_ROUTE } from "@/constants/apiRoutes";
import { PAGE_ROUTES } from "@/constants/pageRoutes";
import { addNewAlertItem } from "@/utils/alert";

import { formValidated } from "./validator";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [email, setEmail] = useState("");
  // ----------------------------------------------------------------
  // ----------------------------------------------------------------
  const [sendResetPassEmail, setSendResetPassEmail] = useState(false);
  const { status, data } = useApiCalls({
    method: "POST",
    url: USER_FORGOT_PASSWORD_API_ROUTE,
    bodyData: {
      email,
    },
    sendReq: sendResetPassEmail,
    setSendReq: setSendResetPassEmail,
  });
  useEffect(() => {
    if (data?.success) {
      addNewAlertItem(
        dispatch,
        "success",
        "You will receive an email with instructions to reset your password."
      );
      router.push(PAGE_ROUTES.APP.LOGIN);
    }
  }, [data]);
  // ----------------------------------------------------------------
  // ----------------------------------------------------------------
  return (
    <>
      <LoginRegisterTemplate>
        <Heading type={1} className="text-center m-b-32">
          Forgot Your Password?
        </Heading>
        <Form
          onSubmit={(e) => {
            if (formValidated(dispatch, email)) {
              setSendResetPassEmail(true);
            }
          }}
        >
          <Div className="width-per-100 m-b-16">
            <TextBox
              label={"Email"}
              placeHolder={"Enter your email address"}
              type={"text"}
              name={"email"}
              isRequired
              forceLightMode
              val={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Div>
          <Div type="flex" hAlign="center" className="m-y-32 width-per-100">
            <Button btnText={"Reset My Password"} className="width-px-300" />
          </Div>
        </Form>
        <Div distributedBetween type="flex" className="m-b-16" vAlign="center">
          <Div
            className="width-per-100 bg-theme-two"
            style={{ height: "2px" }}
          />
        </Div>
        <Div type="flex" className="">
          <Anchor to={PAGE_ROUTES.APP.LOGIN} anchorType="no-effect" internal>
            <Div className="text-underline m-t-16 text-center">
              Remeber your password? Sign in to your account!
            </Div>
          </Anchor>
        </Div>
      </LoginRegisterTemplate>
    </>
  );
};

export default ForgotPassword;
