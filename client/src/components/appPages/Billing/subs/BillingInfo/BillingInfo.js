import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import Div from "@/baseComponents/reusableComponents/Div";
import Form from "@/baseComponents/formComponents/Form";
import TextBox from "@/baseComponents/formComponents/TextBox";
import Select from "@/baseComponents/formComponents/Select";
import Button from "@/baseComponents/reusableComponents/Button";

import useApiCalls from "@/hooks/useApiCalls";
import { USER_BILLING_API_ROUTE } from "@/constants/apiRoutes";
import {
  getAllCountries,
  getStatesForCountry,
} from "@/constants/countriesData";
import { addNewAlertItem } from "@/utils/alert";

import { formValidated } from "./validator";

const BillingInfo = ({ setHasBillingInfo }) => {
  const dispatch = useDispatch();
  // ------------------------------------------------
  // Form States
  // ------------------------------------------------
  const [allCountries, setAllCountries] = useState([]);
  const [allStates, setAllStates] = useState([]);

  const [billingInfo, setBillingInfo] = useState({
    billing_name: "",
    billing_country: "",
    billing_address: "",
    billing_city: "",
    billing_state: "",
    billing_zipcode: "",
  });

  useEffect(() => {
    const fetchCountries = () => {
      const countries = getAllCountries();
      setAllCountries(countries);
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (!billingInfo?.billing_country) return;
    const states = getStatesForCountry(billingInfo?.billing_country);
    setAllStates(states);
  }, [billingInfo?.billing_country]);

  // ------------------------------------------------
  // Fetch Billing Info
  // ------------------------------------------------
  const [fetchBillingInfo, setFetchBillingInfo] = useState(false);
  const { status, data } = useApiCalls({
    method: "GET",
    url: USER_BILLING_API_ROUTE,
    sendReq: fetchBillingInfo,
    setSendReq: setFetchBillingInfo,
  });
  useEffect(() => {
    if (data?.id) {
      setBillingInfo(data);
      if (setHasBillingInfo) {
        setHasBillingInfo(true);
      }
    }
  }, [data]);
  useEffect(() => {
    setFetchBillingInfo(true);
  }, []);
  // ------------------------------------------------
  // ------------------------------------------------

  // ------------------------------------------------
  // Update Billing Info
  // ------------------------------------------------
  const [updateBillingInfo, setUpdateBillingInfo] = useState(false);
  const { status: updateStatus, data: updateData } = useApiCalls({
    method: "POST",
    url: USER_BILLING_API_ROUTE,
    bodyData: billingInfo,
    sendReq: updateBillingInfo,
    setSendReq: setUpdateBillingInfo,
  });
  useEffect(() => {
    if (updateData?.id) {
      setFetchBillingInfo(true);
      addNewAlertItem(
        dispatch,
        "success",
        "Billing Info Updated Successfully!"
      );
    }
  }, [updateData]);
  // ------------------------------------------------
  // ------------------------------------------------
  return (
    <>
      <Form
        onSubmit={() => {
          if (formValidated(dispatch, billingInfo)) {
            setUpdateBillingInfo(true);
          }
        }}
        className="width-per-100"
      >
        <Div type="flex" className="flex--wrap">
          <Div className="m-r-16 m-b-16 flex--grow--1">
            <TextBox
              label="Billing Name (Full Name / Company Name)"
              val={billingInfo?.billing_name}
              onChange={(e) =>
                setBillingInfo({ ...billingInfo, billing_name: e.target.value })
              }
              isRequired
            />
          </Div>
          <Div className="flex--grow--1 m-b-16">
            <Select
              options={allCountries}
              placeHolder="Select Country"
              isRequired
              label="Country"
              val={billingInfo?.billing_country}
              optionChanged={(val) => {
                setBillingInfo({
                  ...billingInfo,
                  billing_country: val,
                  billing_state: "",
                });
              }}
            />
          </Div>
        </Div>
        <Div className="m-b-16">
          <TextBox
            label="Billing Address"
            val={billingInfo?.billing_address}
            onChange={(e) =>
              setBillingInfo({
                ...billingInfo,
                billing_address: e.target.value,
              })
            }
            isRequired
          />
        </Div>
        <Div type="flex" className="flex--wrap">
          <Div className="m-r-16 m-b-16 flex--grow--1">
            <TextBox
              label="City"
              val={billingInfo?.billing_city}
              onChange={(e) =>
                setBillingInfo({ ...billingInfo, billing_city: e.target.value })
              }
              isRequired
            />
          </Div>
          <Div className="m-r-16 m-b-16 flex--grow--1">
            <Select
              options={allStates}
              label="State/Province"
              placeHolder="Select State/Province"
              isRequired
              val={billingInfo?.billing_state}
              optionChanged={(val) =>
                setBillingInfo({ ...billingInfo, billing_state: val })
              }
            />
          </Div>
          <Div className="m-r-16 m-b-16 flex--grow--1">
            <TextBox
              label="Zip/Postal Code"
              val={billingInfo?.billing_zipcode}
              onChange={(e) =>
                setBillingInfo({
                  ...billingInfo,
                  billing_zipcode: e.target.value,
                })
              }
              isRequired
            />
          </Div>
        </Div>
        <Div>
          <Button
            className="width-px-300 m-t-16"
            btnText="Update Billing Info"
          />
        </Div>
      </Form>
    </>
  );
};

export default BillingInfo;
