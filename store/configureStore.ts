import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";

export const getProductionMiddleware = (prevMiddleware: any) => {
  // include default middleware, Thunk
  return prevMiddleware.slice().concat([
    // other middleware
  ]);
};

export const getTestMiddleware = (prevMiddleware: any) => {
  return prevMiddleware.slice().concat([
    // other middleware
  ]);
};

export const configureAppStore = (getMiddleware: any) => () =>
  configureStore({
    reducer,
    middleware: getDefaultMiddleware => getMiddleware(getDefaultMiddleware()),
  });

const store = configureAppStore(getProductionMiddleware);

export type Store = typeof store;

export default store;
