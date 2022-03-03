import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { LoginData, RegisterData, UserLogin, UserWithPassword } from "models/User";
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
  registerData: RegisterData | null;
  loginData: LoginData | null,
};
const initialState: UsersState = {
  bearerToken: null,
  userId: null,
  requests: {},
  registerData: null,
  loginData: null,
};

export type RegisterUserResult = {
  registerData: RegisterData;
  success?: boolean;
};

export type LoginUserResult = {
  loginData: LoginData;
  success?: boolean;
}

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
    registerData: await result.promise,
    success: true,
  };
});

export const loginUser = createAsyncThunk<
  // Return type of the payload creator
  LoginUserResult,
  // First argument to the payload creator
  UserLogin,
  AppThunkAPI
>("user/login", async (userLogin, thunkAPI): Promise<LoginUserResult> => {
  const result = thunkAPI.extra.serviceApi.loginUser(userLogin, loginData => {
    thunkAPI.dispatch(userLoggedIn({ ...loginData }))
    thunkAPI.dispatch(newBearerToken(loginData.token))
  });
  thunkAPI.signal.addEventListener("abort", result.abort);
  result.promise.catch(errorMessage => thunkAPI.rejectWithValue(errorMessage));
  return {
    loginData: await result.promise,
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
    userLoggedIn: (user, action:PayloadAction<LoginData>) => {
      user.loginData = action.payload;
    },
    userRegistered: (user, action:PayloadAction<RegisterData>) => {
      user.registerData = action.payload;
    },
    newBearerTokenSet: (user, action:PayloadAction<string>) => {
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
    {
      const { pending, fulfilled, rejected } = requestReducers(
        "loginUser",
        1
      );
      builder.addCase(loginUser.pending, pending);
      builder.addCase(loginUser.fulfilled, fulfilled);
      builder.addCase(loginUser.rejected, rejected);
    }
  },
});

export const { userRegistered, userLoggedIn, newBearerTokenSet } = slice.actions;

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

export const {
  lastSelector: loginUserRequestSelector,
  errorSelector: loginUserErrorSelector,
  stateSelector: loginUserStateSelector,
} = createRequestSelectors("loginUser", userSliceSelector);

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

export const useLoginUser = () => {
  const dispatch = useDispatch();
  return (userLogin: UserLogin) => dispatch(loginUser(userLogin));
};
export const useLoginUserRequest = () =>
  useSelector(loginUserRequestSelector);
export const useLoginUserError = () =>
  useSelector(loginUserErrorSelector);
export const useLoginUserState = () =>
  useSelector(loginUserStateSelector);


