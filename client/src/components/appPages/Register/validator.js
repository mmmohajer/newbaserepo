import { addNewAlertItem, removeAnAlertItem } from "@/utils/alert";
import { isValidEmail } from "@/utils/validators";
import { clearAlert } from "@/reducer/subs/alert";

export const formValidated = (
  dispatch,
  firstName,
  lastName,
  email,
  password,
  confirmPassword
) => {
  dispatch(clearAlert());
  let validated = true;
  if (!firstName) {
    validated = false;
    addNewAlertItem(dispatch, "error", "First name is required");
    return validated;
  }
  if (!lastName) {
    validated = false;
    addNewAlertItem(dispatch, "error", "Last name is required");
    return validated;
  }
  if (!email) {
    validated = false;
    addNewAlertItem(dispatch, "error", "Email is required");
    return validated;
  }
  if (!isValidEmail(email)) {
    validated = false;
    addNewAlertItem(dispatch, "error", "Email is not valid");
    return validated;
  }
  if (!password) {
    validated = false;
    addNewAlertItem(dispatch, "error", "Password is required");
    return validated;
  }
  if (password.length < 8) {
    validated = false;
    addNewAlertItem(
      dispatch,
      "error",
      "Password must be at least 8 characters long"
    );
    return validated;
  }
  if (password !== confirmPassword) {
    validated = false;
    addNewAlertItem(dispatch, "error", "Passwords do not match");
    return validated;
  }
  return validated;
};
