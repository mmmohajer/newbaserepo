import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import cx from "classnames";

import Div from "@/baseComponents/reusableComponents/Div";
import Anchor from "@/baseComponents/reusableComponents/Anchor";
import Icon from "@/baseComponents/reusableComponents/Icon";

import { MENU_ITEMS } from "./constants";
import { COLORS } from "@/constants/vars";

const FooterNavigation = () => {
  const profile = useSelector((state) => state.profile);

  const activeDashboardItem = useSelector((state) => state.activeDashboardItem);

  const [menuItems, setMenuItems] = useState([]);
  const [hoveredItem, setHoveredItem] = useState("");

  useEffect(() => {
    if (profile?.user?.groups?.length && MENU_ITEMS) {
      if (profile?.user?.groups?.length && MENU_ITEMS) {
        if (profile?.user?.groups.includes("ADMIN")) {
          setMenuItems(MENU_ITEMS["ADMIN"]);
        }
        if (profile?.user?.groups?.length && MENU_ITEMS) {
          if (profile?.user?.groups.includes("CLIENT")) {
            setMenuItems(MENU_ITEMS["CLIENT"]);
          }
        }
      }
    }
  }, [profile, MENU_ITEMS]);

  return (
    <>
      <Div
        type="flex"
        direction="vertical"
        className="width-per-100 br-top-solid-2 br-theme-one height-px-80 p-x-16 flex--shrink--0 bg-white"
      >
        <Div
          type="flex"
          vAlign="center"
          distributedBetween
          className="flex--grow--1"
        >
          {menuItems?.map((item, idx) => (
            <Div type="flex" key={idx}>
              <Anchor
                to={item?.url}
                anchorType={"app"}
                onMouseEnter={() => setHoveredItem(item?.identifier)}
                onMouseLeave={() => setHoveredItem("")}
              >
                <Div
                  type="flex"
                  direction="vertical"
                  hAlign="center"
                  vAlign="center"
                  key={idx}
                  className=""
                >
                  <Div
                    type="flex"
                    hAlign="center"
                    vAlign="center"
                    className="width-px-20 height-px-20"
                  >
                    <Icon
                      type={item?.icon}
                      color={
                        activeDashboardItem === item?.identifier
                          ? "blue"
                          : hoveredItem === item?.identifier
                          ? "black"
                          : COLORS["theme-two"]
                      }
                    />
                  </Div>

                  <Div
                    className={cx(
                      "mouse-hand f-s-px-14",
                      activeDashboardItem === item?.identifier
                        ? "text-blue"
                        : hoveredItem === item?.identifier
                        ? "text-black"
                        : "text-theme-two"
                    )}
                  >
                    {item?.title}
                  </Div>
                </Div>
              </Anchor>
            </Div>
          ))}
        </Div>
      </Div>
    </>
  );
};

export default FooterNavigation;
