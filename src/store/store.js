import { configureStore } from "@reduxjs/toolkit";
import transactionReducer from "./slices/transactionSlice";
import filterReducer from "./slices/filterSlice";
import roleReducer from "./slices/roleSlice";
import themeReducer from "./slices/themeSlice";

export const store = configureStore({
  reducer: {
    transactions: transactionReducer,
    filter: filterReducer,
    role: roleReducer,
    theme: themeReducer,
  },
});