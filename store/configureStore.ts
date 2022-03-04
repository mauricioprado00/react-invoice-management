import { configureStore } from "@reduxjs/toolkit";
import createClient from "api/apiclient";
import { useDispatch } from "react-redux";
import reducer, { RootState } from "./RootSlice";

const serviceApi = createClient('//localhost:3139', '')

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
