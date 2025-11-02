import { createSlice } from "@reduxjs/toolkit";

const reducerObject = {};
reducerObject["setCart"] = (state, action) => action.payload;

reducerObject["addToCart"] = (state, action) => {
  state.push(action.payload);
};
reducerObject["removeFromCart"] = (state, action) => {
  return state.filter((item) => item.id !== action.payload.id);
};
reducerObject["clearCart"] = (state, action) => {
  return [];
};

const slice = createSlice({
  name: "shoppingCart",
  initialState: [],
  reducers: reducerObject,
});

export const { setCart, addToCart, removeFromCart, clearCart } = slice.actions;
export default slice.reducer;
