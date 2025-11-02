import { useState, useEffect } from "react";
import cx from "classnames";
import { useDispatch, useSelector } from "react-redux";

import Div from "@/baseComponents/reusableComponents/Div";
import Anchor from "@/baseComponents/reusableComponents/Anchor";
import Icon from "@/baseComponents/reusableComponents/Icon";
import LogOut from "@/components/appPages/shared/LogOut";

import { COLORS } from "@/constants/vars";
import { PAGE_ROUTES } from "@/constants/pageRoutes";
import {
  toggleAppSecondaryNav,
  hideAppSecondaryNav,
} from "@/reducer/subs/appSecondaryNavIsActive";

import { MENU_ITEMS } from "./constants";

const AppSecondaryNav = () => {
  const dispatch = useDispatch();

  const profile = useSelector((state) => state.profile);
  const appSecondaryNavIsActive = useSelector(
    (state) => state.appSecondaryNavIsActive
  );
  const activeAppSecondaryNavItem = useSelector(
    (state) => state.activeAppSecondaryNavItem
  );

  const [menuItems, setMenuItems] = useState([]);
  const [hoveredItem, setHoveredItem] = useState("");

  useEffect(() => {
    if (profile?.user?.groups?.length && MENU_ITEMS) {
      if (profile?.user?.groups.includes("ADMIN")) {
        setMenuItems(MENU_ITEMS["ADMIN"]);
      } else if (profile?.user?.groups.includes("CLIENT")) {
        setMenuItems(MENU_ITEMS["CLIENT"]);
      }
    }
  }, [profile, MENU_ITEMS]);

  return (
    <>
      <Div className="br-all-solid-2 bg-theme-one br-rad-px-10 br-theme-two width-px-300">
        <Div className="p-all-16">
          {menuItems?.map((item, idx) => (
            <Div
              type="flex"
              key={idx}
              onClick={() => dispatch(hideAppSecondaryNav())}
            >
              <Anchor
                onMouseEnter={() => setHoveredItem(item?.identifier)}
                onMouseLeave={() => setHoveredItem("")}
                to={item?.url}
                anchorType={"app"}
              >
                <Div
                  type="flex"
                  vAlign="center"
                  key={idx}
                  className={cx(idx > 0 ? "m-t-16" : "")}
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
                        activeAppSecondaryNavItem === item?.identifier
                          ? "blue"
                          : hoveredItem === item?.identifier
                          ? "black"
                          : COLORS["theme-two"]
                      }
                    />
                  </Div>

                  <Div
                    className={cx(
                      "mouse-hand m-l-4",
                      activeAppSecondaryNavItem === item?.identifier
                        ? "text-blue"
                        : "text-gray"
                    )}
                  >
                    {item?.title}
                  </Div>
                </Div>
              </Anchor>
            </Div>
          ))}
        </Div>

        <Div className="p-b-16 p-l-16 p-r-16">
          <LogOut>
            <Div
              type="flex"
              vAlign="center"
              className="mouse-hand text-theme-two text-black-on-hover"
              onMouseEnter={() => setHoveredItem("log_out")}
              onMouseLeave={() => setHoveredItem("")}
              onClick={() => dispatch(hideAppSecondaryNav())}
            >
              <Div
                type="flex"
                hAlign="center"
                vAlign="center"
                className="width-px-20 height-px-20"
              >
                <Icon
                  type={"right-from-bracket"}
                  color={
                    hoveredItem === "log_out" ? "black" : COLORS["theme-two"]
                  }
                />
              </Div>

              <Div className="m-l-4">Log Out</Div>
            </Div>
          </LogOut>
        </Div>
      </Div>
    </>
  );
};

export default AppSecondaryNav;
