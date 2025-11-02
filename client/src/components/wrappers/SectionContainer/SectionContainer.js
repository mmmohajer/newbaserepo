import cx from "classnames";

import Div from "@/baseComponents/reusableComponents/Div";
import AnimateContainerOnScroll from "@/baseComponents/reusableComponents/AnimateContainerOnScroll";

import styles from "./SectionContainer.module.scss";

const SectionContainer = ({
  hasHorizontalPadding = true,
  hasVerticalPadding = true,
  hasAnimation = false,
  children,
  className,
}) => {
  return (
    <>
      <AnimateContainerOnScroll
        className={cx(hasAnimation && styles.anim)}
        activeClassName={cx(hasAnimation && styles.animIsActive)}
      >
        <Div
          className={cx(
            "width-per-100 global-container",
            hasHorizontalPadding ? "p-x-temp-10" : "",
            hasVerticalPadding ? "p-y-temp-15" : "",
            className
          )}
        >
          {children}
        </Div>
      </AnimateContainerOnScroll>
    </>
  );
};

export default SectionContainer;
