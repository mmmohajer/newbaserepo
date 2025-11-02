import { PAGE_ROUTES } from "@/constants/pageRoutes";

const ADMIN_MENU_ITEMS = [
  {
    identifier: "settings",
    icon: "gear",
    title: "Settings",
    url: PAGE_ROUTES.APP.SETTINGS,
  },
];

export const CLIENT_MENU_ITEMS = [
  {
    identifier: "billing",
    icon: "money-bill",
    title: "Billing",
    url: PAGE_ROUTES.APP.BILLING,
  },
  {
    identifier: "settings",
    icon: "gear",
    title: "Settings",
    url: PAGE_ROUTES.APP.SETTINGS,
  },
];

export const MENU_ITEMS = {
  ADMIN: ADMIN_MENU_ITEMS,
  CLIENT: CLIENT_MENU_ITEMS,
};
