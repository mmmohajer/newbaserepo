import { createSlice } from "@reduxjs/toolkit";

const reducerObject = {};
reducerObject["setActiveAppSecondaryNavItem"] = (state, action) =>
  action.payload;

const slice = createSlice({
  name: "activeAppSecondaryNavItem",
  initialState: "",
  reducers: reducerObject,
});

export const { setActiveAppSecondaryNavItem } = slice.actions;
export default slice.reducer;
