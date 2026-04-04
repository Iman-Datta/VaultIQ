import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: localStorage.getItem("vaultiq_theme") || "light",
  },
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === "dark" ? "light" : "dark";
      localStorage.setItem("vaultiq_theme", state.mode);
    },
    setTheme(state, action) {
      state.mode = action.payload;
      localStorage.setItem("vaultiq_theme", action.payload);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;