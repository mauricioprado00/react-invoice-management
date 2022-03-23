import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { defaultAvatar } from "components/ui/forms/AvatarSelector";
import { useThunkDispatch } from "hooks/use-thunk-dispatch";
import { PaymentType } from "models/Invoice";
import {
  LoginResponse,
  RegisterData,
  LoginCredentials,
  UserWithPassword,
  Me,
} from "models/User";
import { MapType } from "models/UtilityModels";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppThunkAPI } from "./configureStore";
import {
  createRequestSelectors,
  RequestInformation,
  requestReducers,
} from "./RequestUtility";
import { RootState } from "./RootSlice";

let loadMeBegan = false;

export type UsersState = {
  validatedToken: boolean;
  bearerToken: string | null;
  requests: MapType<MapType<RequestInformation>>;
  registerData: RegisterData | null;
  loginData: LoginResponse | null;
  me: Me | null;
};

const initialState: UsersState = {
  validatedToken: false,
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

export type UpdateMeResult = {
  me: Me;
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
>(
  "user/login",
  async (loginCredentials, thunkAPI): Promise<LoginUserResult> => {
    const result = thunkAPI.extra.serviceApi.loginUser(
      loginCredentials,
      async loginData => {
        await thunkAPI.dispatch(newBearerToken(loginData.token));
        thunkAPI.dispatch(userLoggedIn({ ...loginData }));
      }
    );
    thunkAPI.signal.addEventListener("abort", result.abort);
    result.promise.catch(errorMessage =>
      thunkAPI.rejectWithValue(errorMessage)
    );
    return {
      loginData: await result.promise,
      success: true,
    };
  }
);

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
  const validatedToken = result.meta.requestStatus === "fulfilled";
  thunkAPI.dispatch(storageTokenValidated(validatedToken));
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

export const updateMe = createAsyncThunk<
  // Return type of the payload creator
  UpdateMeResult,
  // First argument to the payload creator
  Me,
  AppThunkAPI
>("me/update", async (me, thunkAPI): Promise<UpdateMeResult> => {
  const result = thunkAPI.extra.serviceApi.updateMe(me, x => {
    thunkAPI.dispatch(meUpdated({ ...x }));
  });
  thunkAPI.signal.addEventListener("abort", result.abort);
  result.promise.catch(errorMessage => thunkAPI.rejectWithValue(errorMessage));
  return {
    me: await result.promise,
    success: true,
  };
});

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLoggedOut: () => {
      localStorage.removeItem("userSlice.bearerToken");
      return { ...initialState };
    },
    userLoggedIn: (user, action: PayloadAction<LoginResponse>) => {
      user.validatedToken = true;
      user.loginData = action.payload;
      loadMeBegan = false;
    },
    meLoaded: (user, action: PayloadAction<Me>) => {
      user.me = action.payload;
    },
    meUpdated: (user, action: PayloadAction<Me>) => {
      user.me = action.payload;
    },
    storageTokenValidated: (user, action: PayloadAction<boolean>) => {
      user.validatedToken = true;
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
    {
      const { pending, fulfilled, rejected } = requestReducers("updateMe", 1);
      builder.addCase(updateMe.pending, pending);
      builder.addCase(updateMe.fulfilled, fulfilled);
      builder.addCase(updateMe.rejected, rejected);
    }
  },
});

export const {
  userRegistered,
  userLoggedOut,
  userLoggedIn,
  meLoaded,
  meUpdated,
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

const validatedTokenSelector = createSelector(
  userSliceSelector,
  userSlice => userSlice.validatedToken
);

export const isLoggedInSelector = createSelector(
  bearerTokenSelector,
  validatedTokenSelector,
  (bearerToken, validatedToken) =>
    validatedToken === false ? null : bearerToken !== null
);

export const meSelector = createSelector(
  userSliceSelector,
  userSlice => userSlice.me
);

export const paymentSelector = createSelector(
  meSelector,
  me => {
    const types = [];
    if (me?.companyDetails?.swift) {
      types.push({
        accountType: "swift",
        accountNumber: me?.companyDetails?.swift,
      })
    }
    if (me?.companyDetails?.iban) {
      types.push({
        accountType: "iban",
        accountNumber: me?.companyDetails?.iban,
      })
    }

    return types as PaymentType[];
  }
)

export const avatarSelector = createSelector(
  meSelector,
  me => me?.avatar
)

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

export const {
  lastSelector: updateMeRequestSelector,
  errorSelector: updateMeErrorSelector,
  stateSelector: updateMeStateSelector,
} = createRequestSelectors("updateMe", userSliceSelector);

// business logic

export const isProfileFilledSelector = createSelector(meSelector, me =>
  !me ? null :
  [
    me?.companyDetails?.address,
    me?.companyDetails?.name,
    me?.companyDetails?.regNumber,
    me?.companyDetails?.vatNumber,
    me?.companyDetails?.swift || me.companyDetails?.iban,
  ].reduce((filled, value) => filled && value !== undefined, true)
);

// hooks
const useMeSelector = <TState, TSelected>(
  selector: (state: TState) => TSelected
) => {
  const dispatch = useThunkDispatch();
  useEffect(() => {
    if (!loadMeBegan) {
      loadMeBegan = true;
      dispatch(loadMe());
    }
  }, [dispatch]);
  return useSelector<TState, TSelected>(selector);
};

export const useRegisterUser = () => {
  const dispatch = useThunkDispatch();
  return useCallback(
    (user: UserWithPassword) => dispatch(registerUser(user)),
    [dispatch]
  );
};
export const useRegisterUserRequest = () =>
  useSelector(registerUserRequestSelector);
export const useRegisterUserError = () =>
  useSelector(registerUserErrorSelector);
export const useRegisterUserState = () =>
  useSelector(registerUserStateSelector);

export const useLoginUser = () => {
  const dispatch = useThunkDispatch();
  return useCallback(
    (loginCredentials: LoginCredentials) =>
      dispatch(loginUser(loginCredentials)),
    [dispatch]
  );
};
export const useLoginUserRequest = () => useSelector(loginUserRequestSelector);
export const useLoginUserError = () => useSelector(loginUserErrorSelector);
export const useLoginUserState = () => useSelector(loginUserStateSelector);

export const useBearerToken = () => useSelector(bearerTokenSelector);

export const useIsLoggedIn = () => useSelector(isLoggedInSelector);

export const useInitLoggedFromStorage = () => {
  const bearerToken = useBearerToken();
  const dispatch = useThunkDispatch();
  useEffect(() => {
    if (bearerToken === null) {
      dispatch(initLoggedFromStorage());
    }
  }, [dispatch, bearerToken]);
};

export const useMe = () => useMeSelector(meSelector);
export const useLoadMeRequest = () => useSelector(loadMeRequestSelector);
export const useLoadMeError = () => useSelector(loadMeErrorSelector);
const useLoadMeState = () => useSelector(loadMeStateSelector);
export const useMeLoading = () => {
  const state = useLoadMeState();
  return state === "none" || state === "loading";
};
export const useIsProfileFilled = () => useMeSelector(isProfileFilledSelector);

export const useLogoutUser = () => {
  const dispatch = useDispatch();
  return useCallback(() => {
    dispatch(userLoggedOut());
  }, [dispatch]);
};

export const useUpdateMe = () => {
  const dispatch = useThunkDispatch();
  return (me: Me) => dispatch(updateMe(me));
};
export const useUpdateMeRequest = () => useSelector(updateMeRequestSelector);
export const useUpdateMeError = () => useSelector(updateMeErrorSelector);
export const useUpdateMeState = () => useSelector(updateMeStateSelector);

export const usePaymentSelector = () => useMeSelector(paymentSelector);
export const useUserAvatar = () => useSelector(avatarSelector);