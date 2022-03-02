import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { UserWithPassword } from "models/User";
import { MapType } from "models/UtilityModels";
import { useDispatch, useSelector } from "react-redux";

import { AppThunkAPI } from "./configureStore";
import {
  createRequestSelectors,
  RequestInformation,
  requestReducers,
} from "./RequestUtility";
import { RootState } from "./RootSlice";

export type UsersState = {
  bearerToken: string | null;
  userId: string | null;
  requests: MapType<MapType<RequestInformation>>;
  registeredUserId: string | null;
};
const initialState: UsersState = {
  bearerToken: null,
  userId: null,
  requests: {},
  registeredUserId: null,
};

export type RegisterUserResult = {
  user: UserWithPassword;
  success?: boolean;
};

export const registerUser = createAsyncThunk<
  // Return type of the payload creator
  RegisterUserResult,
  // First argument to the payload creator
  UserWithPassword,
  AppThunkAPI
>("user/register", async (user, thunkAPI): Promise<RegisterUserResult> => {
  const result = thunkAPI.extra.serviceApi.registerUser(user, user =>
    thunkAPI.dispatch(userRegistered({ ...user }))
  );
  thunkAPI.signal.addEventListener("abort", result.abort);
  result.promise.catch(errorMessage => thunkAPI.rejectWithValue(errorMessage));
  return {
    user: await result.promise,
    success: true,
  };
});

export const newBearerToken = createAsyncThunk<
  // Return type of the payload creator
  void,
  // First argument to the payload creator
  string,
  AppThunkAPI
>("user/newBearerToken", (bearerToken: string, thunkAPI): void => {
  thunkAPI.extra.serviceApi.newBearerToken(bearerToken);
  thunkAPI.dispatch(slice.actions.newBearerTokenSet(bearerToken));
});

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userRegistered: (user, action) => {
      user.registeredUserId = action.payload.user_id;
    },
    newBearerTokenSet: (user, action) => {
      user.bearerToken = action.payload;
      user.userId = action.payload;
    },
  },
  extraReducers: builder => {
    {
      const { pending, fulfilled, rejected } = requestReducers(
        "registerUser",
        1
      );
      builder.addCase(registerUser.pending, pending);
      builder.addCase(registerUser.fulfilled, fulfilled);
      builder.addCase(registerUser.rejected, rejected);
    }
  },
});

export const { userRegistered, newBearerTokenSet } = slice.actions;

export default slice.reducer;

// business logic

// selectors
export const userSliceSelector = (state: RootState): UsersState => state.user;

export const userIdSelector = createSelector(
  userSliceSelector,
  user => user.userId
);

export const {
  lastSelector: registerUserRequestSelector,
  errorSelector: registerUserErrorSelector,
  stateSelector: registerUserStateSelector,
} = createRequestSelectors("registerUser", userSliceSelector);

// hooks
export const useRegisterUser = () => {
  const dispatch = useDispatch();
  return (user: UserWithPassword) => dispatch(registerUser(user));
};
export const useRegisterUserRequest = () =>
  useSelector(registerUserRequestSelector);
export const useRegisterUserError = () =>
  useSelector(registerUserErrorSelector);
export const useRegisterUserState = () =>
  useSelector(registerUserStateSelector);
