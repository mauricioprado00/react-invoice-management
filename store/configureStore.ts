import { configureStore } from "@reduxjs/toolkit";
import reducer from "./RootSlice";

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

const serviceApi = {
  something: () => console.log('doing something')
}

export const configureAppStore = (getMiddleware: any) => () =>
  configureStore({
    reducer,
    middleware: getDefaultMiddleware => getMiddleware(getDefaultMiddleware({
      thunk: {
        extraArgument: { serviceApi }
      }
    })),
  });

const store = configureAppStore(getProductionMiddleware);

export type Store = typeof store;


export type AppThunkAPI = {
  extra: {
    serviceApi: typeof serviceApi
  }
}


export default store;
