import { PAGE_ROUTES } from "@/constants/pageRoutes";

const ADMIN_MENU_ITEMS = [
  {
    identifier: "dashboard",
    icon: "gauge",
    title: "Dashboard",
    url: PAGE_ROUTES.APP.DASHBOARD,
  },
];

export const CLIENT_MENU_ITEMS = [
  {
    identifier: "dashboard",
    icon: "gauge",
    title: "Dashboard",
    url: PAGE_ROUTES.APP.DASHBOARD,
  },
];

export const MENU_ITEMS = {
  ADMIN: ADMIN_MENU_ITEMS,
  CLIENT: CLIENT_MENU_ITEMS,
};
