import { createSlice } from "@reduxjs/toolkit";

const reducerObject = {};
reducerObject["setActiveDashboardItem"] = (state, action) => action.payload;

const slice = createSlice({
  name: "activeDashboardItem",
  initialState: "dashboard",
  reducers: reducerObject,
});

export const { setActiveDashboardItem } = slice.actions;
export default slice.reducer;
