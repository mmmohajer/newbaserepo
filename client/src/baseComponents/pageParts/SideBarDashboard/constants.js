import { PAGE_ROUTES } from "@/constants/pageRoutes";

// --------------------------------
// Main Navigation Menu Items
// --------------------------------

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

// --------------------------------
// Secondary Navigation Menu Items
// --------------------------------

const ADMIN_SECONDARY_MENU_ITEMS = [
  {
    identifier: "settings",
    icon: "gear",
    title: "Settings",
    url: PAGE_ROUTES.APP.SETTINGS,
  },
];

export const CLIENT_SECONDARY_MENU_ITEMS = [
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

export const SECONDARY_MENU_ITEMS = {
  ADMIN: ADMIN_SECONDARY_MENU_ITEMS,
  CLIENT: CLIENT_SECONDARY_MENU_ITEMS,
};
