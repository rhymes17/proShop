import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const user = action.payload;
      state.userInfo = user;
      localStorage.setItem("userInfo", JSON.stringify(user));
    },
    logout: (state, action) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
      // localStorage.removeItem("cart");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
