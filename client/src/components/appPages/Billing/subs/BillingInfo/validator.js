import { addNewAlertItem } from "@/utils/alert";
import { clearAlert } from "@/reducer/subs/alert";

export const formValidated = (dispatch, billingInfo) => {
  dispatch(clearAlert());
  let validated = true;
  if (!billingInfo?.billing_name) {
    validated = false;
    addNewAlertItem(dispatch, "error", "Name is required");
    return validated;
  }
  if (!billingInfo?.billing_country) {
    validated = false;
    addNewAlertItem(dispatch, "error", "Country is required");
    return validated;
  }
  if (!billingInfo?.billing_address) {
    validated = false;
    addNewAlertItem(dispatch, "error", "Address is required");
  }
  if (!billingInfo?.billing_city) {
    validated = false;
    addNewAlertItem(dispatch, "error", "City is required");
  }
  if (!billingInfo?.billing_state) {
    validated = false;
    addNewAlertItem(dispatch, "error", "State is required");
  }
  if (!billingInfo?.billing_zipcode) {
    validated = false;
    addNewAlertItem(dispatch, "error", "Zip/Postal Code is required");
  }
  return validated;
};
