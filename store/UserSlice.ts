import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  LoginResponse,
  RegisterData,
  LoginCredentials,
  UserWithPassword,
  Me,
} from "models/User";
import { MapType } from "models/UtilityModels";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppThunkAPI } from "./configureStore";
import {
  createRequestSelectors,
  RequestInformation,
  requestReducers,
} from "./RequestUtility";
import { RootState } from "./RootSlice";

export type UsersState = {
  init: boolean;
  bearerToken: string | null;
  requests: MapType<MapType<RequestInformation>>;
  registerData: RegisterData | null;
  loginData: LoginResponse | null;
  me: Me | null;
};

const initialState: UsersState = {
  init: false,
  bearerToken: null,
  requests: {},
  registerData: null,
  loginData: null,
  me: null,
};

export type RegisterUserResult = {
  registerData: RegisterData;
  success?: boolean;
};

export type LoginUserResult = {
  loginData: LoginResponse;
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
    registerData: await result.promise,
    success: true,
  };
});

export const loginUser = createAsyncThunk<
  // Return type of the payload creator
  LoginUserResult,
  // First argument to the payload creator
  LoginCredentials,
  AppThunkAPI
>("user/login", async (userLogin, thunkAPI): Promise<LoginUserResult> => {
  const result = thunkAPI.extra.serviceApi.loginUser(userLogin, loginData => {
    thunkAPI.dispatch(userLoggedIn({ ...loginData }));
    thunkAPI.dispatch(newBearerToken(loginData.token));
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
  thunkAPI.dispatch(newBearerTokenSet(bearerToken));
});

export const initLoggedFromStorage = createAsyncThunk<
  // Return type of the payload creator
  void,
  // First argument to the payload creator
  void,
  AppThunkAPI
>("user/initLoggedFromStorage", async (arg: void, thunkAPI): Promise<void> => {
  const bearerToken = localStorage.getItem("userSlice.bearerToken") as
    | string
    | null;
  if (bearerToken === null) {
    thunkAPI.dispatch(storageTokenValidated(false));
    return;
  }
  thunkAPI.extra.serviceApi.newBearerToken(bearerToken);
  thunkAPI.dispatch(newBearerTokenSet(bearerToken));
  const result = await thunkAPI.dispatch(loadMe());
  const tokenIsValid = result.meta.requestStatus === "fulfilled";
  thunkAPI.dispatch(storageTokenValidated(tokenIsValid));
});

export const loadMe = createAsyncThunk<
  // Return type of the payload creator
  Me,
  // First argument to the payload creator
  void,
  AppThunkAPI
>("me/load", async (arg, thunkAPI): Promise<Me> => {
  const result = thunkAPI.extra.serviceApi.getMe(me =>
    thunkAPI.dispatch(meLoaded(me))
  );
  thunkAPI.signal.addEventListener("abort", result.abort);
  result.promise.catch(errorMessage => {
    thunkAPI.rejectWithValue(errorMessage);
  });
  const me = await result.promise;
  return me;
});

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLoggedIn: (user, action: PayloadAction<LoginResponse>) => {
      user.loginData = action.payload;
    },
    meLoaded: (user, action: PayloadAction<Me>) => {
      user.me = action.payload;
    },
    storageTokenValidated: (user, action: PayloadAction<boolean>) => {
      user.init = true;
      if (action.payload === false) {
        user.bearerToken = null;
        localStorage.removeItem("userSlice.bearerToken");
      }
    },
    userRegistered: (user, action: PayloadAction<RegisterData>) => {
      user.registerData = action.payload;
    },
    newBearerTokenSet: (user, action: PayloadAction<string | null>) => {
      user.bearerToken = action.payload;
      if (action.payload !== null) {
        localStorage.setItem("userSlice.bearerToken", action.payload);
      }
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
      const { pending, fulfilled, rejected } = requestReducers("loginUser", 1);
      builder.addCase(loginUser.pending, pending);
      builder.addCase(loginUser.fulfilled, fulfilled);
      builder.addCase(loginUser.rejected, rejected);
    }
    {
      const { pending, fulfilled, rejected } = requestReducers("loadMe", 1);
      builder.addCase(loadMe.pending, pending);
      builder.addCase(loadMe.fulfilled, fulfilled);
      builder.addCase(loadMe.rejected, rejected);
    }
  },
});

export const {
  userRegistered,
  userLoggedIn,
  meLoaded,
  storageTokenValidated,
  newBearerTokenSet,
} = slice.actions;

export default slice.reducer;

// business logic

// selectors
export const userSliceSelector = (state: RootState): UsersState => state.user;

export const bearerTokenSelector = createSelector(
  userSliceSelector,
  userSlice => userSlice.bearerToken
);

export const initSelector = createSelector(
  userSliceSelector,
  userSlice => userSlice.init
);

export const isLoggedInSelector = createSelector(
  bearerTokenSelector,
  initSelector,
  (bearerToken, init) => (init === false ? null : bearerToken !== null)
);

export const meSelector = createSelector(
  userSliceSelector,
  userSlice => userSlice.me
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

export const {
  lastSelector: loadMeRequestSelector,
  errorSelector: loadMeErrorSelector,
  stateSelector: loadMeStateSelector,
} = createRequestSelectors("loadMe", userSliceSelector);

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
  return (userLogin: LoginCredentials) => dispatch(loginUser(userLogin));
};
export const useLoginUserRequest = () => useSelector(loginUserRequestSelector);
export const useLoginUserError = () => useSelector(loginUserErrorSelector);
export const useLoginUserState = () => useSelector(loginUserStateSelector);

export const useBearerToken = () => useSelector(bearerTokenSelector);

export const useIsLoggedIn = () => useSelector(isLoggedInSelector);

export const useInitLoggedFromStorage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initLoggedFromStorage());
  }, [dispatch]);
};

export const useMe = () => useSelector(meSelector);
export const useLoadMeRequest = () => useSelector(loadMeRequestSelector);
export const useLoadMeError = () => useSelector(loadMeErrorSelector);
export const useLoadMeState = () => useSelector(loadMeStateSelector);
