import cx from "classnames";
import { useDispatch, useSelector } from "react-redux";

import Div from "@/baseComponents/reusableComponents/Div";

import { toggleSideBarDashboard } from "@/reducer/subs/sideBarDashboardIsActive";

import styles from "./Hamburger.module.scss";

const Hamburger = () => {
  const dispatch = useDispatch();
  const sideBarDashboardIsActive = useSelector(
    (state) => state.sideBarDashboardIsActive
  );

  return (
    <>
      <Div
        type="flex"
        direction="vertical"
        vAlign="center"
        className={cx("mouse-hand", styles.container)}
        onClick={() => dispatch(toggleSideBarDashboard())}
      >
        <Div
          className={cx(styles.line)}
          // className={cx(
          //   sideBarDashboardIsActive ? styles.lineClosed : styles.line
          // )}
        />
      </Div>
    </>
  );
};

export default Hamburger;
