import cx from "classnames";

import Div from "@/baseComponents/reusableComponents/Div";

const AppSectionContainer = ({
  hasPadding = true,
  hasFullHeight = false,
  title = "",
  hasBorder = false,
  children,
}) => {
  return (
    <>
      <Div
        type="flex"
        direction="vertical"
        className={cx("width-per-100", {
          "p-all-16": hasPadding,
          "flex--grow--1": hasFullHeight,
        })}
      >
        {title ? (
          <Div className="f-b f-s-px-20 m-b-16 text-theme-two">{title}</Div>
        ) : null}
        <Div
          type="flex"
          direction="vertical"
          className={cx("flex--grow--1", {
            "br-all-solid-2 br-theme-one p-all-16 br-rad-px-10": hasBorder,
          })}
        >
          {children}
        </Div>
      </Div>
    </>
  );
};

export default AppSectionContainer;
