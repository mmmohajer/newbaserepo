import { combineReducers } from "redux";

import activeMenu from "./subs/activeMenu";
import activeSubMenuItem from "./subs/activeSubMenuItem";
import mainContainerWidth from "./subs/mainContainerWidth";
import isMobNavVisible from "./subs/isMobNavVisible";
import modal from "./subs/modal";
import isLoading from "./subs/isLoading";
import alert from "./subs/alert";
import profile from "./subs/profile";
import sideBarDashboardIsActive from "./subs/sideBarDashboardIsActive";
import scrollPos from "./subs/scrollPos";
import accessToken from "./subs/accessToken";
import activeDashboardItem from "./subs/activeDashboardItem";
import appSecondaryNavIsActive from "./subs/appSecondaryNavIsActive";
import activeAppSecondaryNavItem from "./subs/activeAppSecondaryNavItem";
import shoppingCart from "./subs/shoppingCart";

const reducer = combineReducers({
  activeMenu,
  activeSubMenuItem,
  mainContainerWidth,
  isMobNavVisible,
  modal,
  isLoading,
  alert,
  profile,
  sideBarDashboardIsActive,
  scrollPos,
  accessToken,
  activeDashboardItem,
  appSecondaryNavIsActive,
  activeAppSecondaryNavItem,
  shoppingCart,
});

export default reducer;
