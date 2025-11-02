import { useState, useEffect, use } from "react";
import cx from "classnames";
import { useDispatch, useSelector } from "react-redux";

import Div from "@/baseComponents/reusableComponents/Div";
import Anchor from "@/baseComponents/reusableComponents/Anchor";
import Icon from "@/baseComponents/reusableComponents/Icon";
import LogOut from "@/components/appPages/shared/LogOut";

import Hamburger from "./subs/Hamburger";
import { MENU_ITEMS, SECONDARY_MENU_ITEMS } from "./constants";
import { COLORS } from "@/constants/vars";
import { PAGE_ROUTES } from "@/constants/pageRoutes";

const SideBarDashboard = () => {
  const profile = useSelector((state) => state.profile);
  const sideBarDashboardIsActive = useSelector(
    (state) => state.sideBarDashboardIsActive
  );
  const activeDashboardItem = useSelector((state) => state.activeDashboardItem);

  const [menuItems, setMenuItems] = useState([]);
  const [secondaryMenuItems, setSecondaryMenuItems] = useState([]);
  const [hoveredItem, setHoveredItem] = useState("");

  useEffect(() => {
    if (profile?.user?.groups?.length && MENU_ITEMS) {
      if (profile?.user?.groups.includes("ADMIN")) {
        setMenuItems(MENU_ITEMS["ADMIN"]);
        setSecondaryMenuItems(SECONDARY_MENU_ITEMS["ADMIN"]);
      } else if (profile?.user?.groups.includes("CLIENT")) {
        setMenuItems(MENU_ITEMS["CLIENT"]);
        setSecondaryMenuItems(SECONDARY_MENU_ITEMS["CLIENT"]);
      }
    }
  }, [profile, MENU_ITEMS]);

  return (
    <>
      <Div
        type="flex"
        direction="vertical"
        className={cx(
          "height-vh-full of-y-auto global-transition-one of-x-hidden flex--shrink--0",
          sideBarDashboardIsActive ? "width-px-150" : "width-px-50"
        )}
      >
        <Div
          type="flex"
          hAlign="center"
          vAlign="center"
          className="br-bottom-solid-2 br-theme-one height-px-85"
        >
          <Hamburger />
        </Div>
        <Div
          type="flex"
          direction="vertical"
          distributedBetween
          className="br-right-solid-2 br-theme-one flex--grow--1"
        >
          <Div className="p-all-16">
            {menuItems?.map((item, idx) => (
              <Div type="flex" key={idx}>
                <Anchor
                  onMouseEnter={() => setHoveredItem(item?.identifier)}
                  onMouseLeave={() => setHoveredItem("")}
                  to={item?.url}
                  anchorType={"app"}
                >
                  <Div type="flex" vAlign="center" key={idx} className="m-b-16">
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
                    {sideBarDashboardIsActive ? (
                      <Div
                        className={cx(
                          "mouse-hand m-l-4 f-s-px-14",
                          activeDashboardItem === item?.identifier
                            ? "text-blue"
                            : "text-gray"
                        )}
                      >
                        {item?.title}
                      </Div>
                    ) : null}
                  </Div>
                </Anchor>
              </Div>
            ))}
          </Div>
          <Div>
            {/* Secondary Section */}

            <Div className="p-all-16 br-top-solid-2 br-theme-one">
              {secondaryMenuItems?.map((item, idx) => (
                <Div type="flex" key={idx}>
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
                      className="m-b-16"
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
                      {sideBarDashboardIsActive ? (
                        <Div
                          className={cx(
                            "mouse-hand m-l-4 f-s-px-14",
                            activeDashboardItem === item?.identifier
                              ? "text-blue"
                              : "text-gray"
                          )}
                        >
                          {item?.title}
                        </Div>
                      ) : null}
                    </Div>
                  </Anchor>
                </Div>
              ))}
              <LogOut>
                <Div
                  type="flex"
                  vAlign="center"
                  className="mouse-hand text-theme-two text-black-on-hover"
                  onMouseEnter={() => setHoveredItem("log_out")}
                  onMouseLeave={() => setHoveredItem("")}
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
                        hoveredItem === "log_out"
                          ? "black"
                          : COLORS["theme-two"]
                      }
                    />
                  </Div>

                  {sideBarDashboardIsActive ? (
                    <Div
                      className={cx(
                        "mouse-hand m-l-4 f-s-px-14",
                        activeDashboardItem === "log_out"
                          ? "text-blue"
                          : "text-gray"
                      )}
                    >
                      Log Out
                    </Div>
                  ) : null}
                </Div>
              </LogOut>
            </Div>
          </Div>
        </Div>
      </Div>
    </>
  );
};

export default SideBarDashboard;
