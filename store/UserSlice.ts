import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";

import { AppThunkAPI } from "./configureStore";
import { RootState } from "./RootSlice";

export type UsersState = {
  bearerToken: string | null;
  userId: string | null
};
const initialState: UsersState = {
  bearerToken: null,
  userId: null,
};

export const newBearerToken = createAsyncThunk<
  // Return type of the payload creator
  void,
  // First argument to the payload creator
  string,
  AppThunkAPI
>("user/newBearerToken", (bearerToken:string, thunkAPI): void => {
  thunkAPI.extra.serviceApi.newBearerToken(bearerToken);
  thunkAPI.dispatch(slice.actions.newBearerTokenSet(bearerToken))
});

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    newBearerTokenSet: (user, action) => {
        user.bearerToken = action.payload;
        user.userId = action.payload;
    }
  },
  extraReducers: builder => {
      
  },
});

export default slice.reducer;

// business logic

// selectors
export const userSliceSelector = (state: RootState): UsersState =>
  state.user;

export const userIdSelector = createSelector(
  userSliceSelector,
  user => user.userId,
)
