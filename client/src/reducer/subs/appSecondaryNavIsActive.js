import { createSlice } from "@reduxjs/toolkit";

const reducerObject = {};
reducerObject["showAppSecondaryNav"] = (state, action) => true;
reducerObject["hideAppSecondaryNav"] = (state, action) => false;
reducerObject["toggleAppSecondaryNav"] = (state, action) => !state;

const slice = createSlice({
  name: "appSecondaryNavIsActive",
  initialState: false,
  reducers: reducerObject,
});

export const {
  showAppSecondaryNav,
  hideAppSecondaryNav,
  toggleAppSecondaryNav,
} = slice.actions;
export default slice.reducer;
