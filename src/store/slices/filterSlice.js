import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchQuery: "",
  typeFilter: "all",
  startDate: "",
  endDate: "",
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setSearch(state, action) {
      state.searchQuery = action.payload;
    },

    setTypeFilter(state, action) {
      state.typeFilter = action.payload;
    },

    setStartDate(state, action) {
      state.startDate = action.payload;
    },

    setEndDate(state, action) {
      state.endDate = action.payload;
    },

    clearFilters(state) {
      state.searchQuery = "";
      state.typeFilter = "all";
      state.startDate = "";
      state.endDate = "";
    },
  },
});

export const {
  setSearch,
  setTypeFilter,
  setStartDate,
  setEndDate,
  clearFilters,
} = filterSlice.actions;

export default filterSlice.reducer;