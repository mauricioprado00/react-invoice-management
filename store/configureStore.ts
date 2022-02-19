import { AsyncThunkAction, configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import reducer, { RootState } from "./RootSlice";

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

// interface Action<T = any> {
//   type: T
// }

// interface AnyAction extends Action {
//   // Allows any extra properties to be defined in an action.
//   [extraProps: string]: any
// }

// type AnyActionOrThunk = AnyAction | AsyncThunkAction<any, any, any>


export const configureAppStore = (getMiddleware: any) => () =>
  configureStore<RootState, any>({
    reducer,
    middleware: getDefaultMiddleware => getMiddleware(getDefaultMiddleware({
      thunk: {
        extraArgument: { serviceApi }
      }
    })),
  });

export const createStore = configureAppStore(getProductionMiddleware);

const store = createStore()

export type Store = typeof store;


export type AppThunkAPI = {
  extra: {
    serviceApi: typeof serviceApi
  }
}

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store;
