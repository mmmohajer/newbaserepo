import { useSelector } from "react-redux";
import cx from "classnames";

import Div from "@/baseComponents/reusableComponents/Div";

import styles from "./DiscountedPrice.module.scss";

const DiscountedPrice = ({ basePrice, price }) => {
  return (
    <>
      {parseFloat(basePrice) !== parseFloat(price) ? (
        <Div type="flex" vAlign="center" className={cx("gap-16")}>
          <Div className={cx("f-s-px-14 text-red", styles.basePrice)}>
            ${basePrice}
          </Div>
          <Div>${price}</Div>
        </Div>
      ) : (
        <Div type="flex" vAlign="center" className={cx("gap-16")}>
          <Div>${price}</Div>
        </Div>
      )}
    </>
  );
};

export default DiscountedPrice;
