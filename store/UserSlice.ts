import {
  createAsyncThunk,
  createSlice,
  SerializedError,
} from "@reduxjs/toolkit";

import { AppThunkAPI } from "./configureStore";
import { RootState } from "./RootSlice";

export type RequestState = "loading" | "loaded" | "error" | "aborted";
export type UsersState = {
  bearerToken: string | null;
};
const initialState: UsersState = {
  bearerToken: null,
};

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    newBearerToken: (user, action) => {
        user.bearerToken = action.payload;
    }
  },
  extraReducers: builder => {
      
  },
});

export const { newBearerToken } = slice.actions;

export default slice.reducer;

// business logic

// selectors
export const userSliceSelector = (state: RootState): UsersState =>
  state.user;
