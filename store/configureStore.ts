import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import reducer, { RootState } from "./RootSlice";

const serviceApi = {
  something: () => console.log('doing something')
}

const thunkApiExtraArgument = { serviceApi }
export const createStore = () =>
  configureStore({
    reducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({
      thunk: {
        extraArgument: thunkApiExtraArgument
      }
    }),
  });

const store = createStore()

export type Store = typeof store;

export type AppThunkAPI = {
  dispatch: AppDispatch
  state: RootState
  extra: typeof thunkApiExtraArgument
}

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store;
