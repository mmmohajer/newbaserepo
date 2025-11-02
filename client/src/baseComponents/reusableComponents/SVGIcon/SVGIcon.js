import cx from "classnames";

import Div from "@/baseComponents/reusableComponents/Div";

import Moon from "./subs/Moon";
import Sun from "./subs/Sun";
import Arrow from "./subs/Arrow";
import Quote from "./subs/Quote";
import Google from "./subs/Google";
import AmericanExpress from "./subs/AmericanExpress";
import DinersCard from "./subs/DinersCard";
import DiscoverCard from "./subs/DiscoverCard";
import JcbCard from "./subs/JcbCard";
import MasterCard from "./subs/MasterCard";
import Visa from "./subs/Visa";

const SVGIcon = ({
  type,
  fill = "none",
  stroke = "black",
  width = 30,
  height = 30,
}) => {
  const IconComponent = iconMap[type];
  if (!IconComponent) return null;
  return (
    <IconComponent fill={fill} stroke={stroke} height={height} width={width} />
  );
};

const iconMap = {
  moon: Moon,
  sun: Sun,
  arrow: Arrow,
  quote: Quote,
  google: Google,
  visa: Visa,
  "master-card": MasterCard,
  "amex-card": AmericanExpress,
  "diners-card": DinersCard,
  "discover-card": DiscoverCard,
  "jcb-card": JcbCard,
};

export default SVGIcon;
