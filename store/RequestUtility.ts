import {
  createSelector,
  PayloadAction,
  SerializedError,
} from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { MapType } from "models/UtilityModels";

export type RequestState = "none" | "loading" | "loaded" | "error" | "aborted";
export type RequestInformation = {
  time: number;
  state: RequestState;
  error?: SerializedError;
};

type StateSlice = WritableDraft<MapType<any>>;

// will reduce a map object and keep the latest key values
export const sliceMap = <T>(map: MapType<T>, keep: number): void => {
  const keys = Object.keys(map);
  if (keys.length > keep) {
    keys.slice(0, keys.length - keep).forEach(key => delete map[key]);
  }
};

export const initStateRequestId = (stateSlice:WritableDraft<StateSlice>, requestType: string, requestId:string) => {
  if (stateSlice.requests === undefined) {
    stateSlice.requests = [];
  }
  if (stateSlice.requests[requestType] === undefined) {
    stateSlice.requests[requestType] = {};
  }
  if (stateSlice.requests[requestType][requestId] === undefined) {
    stateSlice.requests[requestType][requestId] = {
      time: Date.now(),
    };  
  }

  return stateSlice.requests[requestType][requestId] as RequestInformation;
}

export const requestFullfilledReducer =
  (
    requestType: string,
    keep: number
  ): {
    (
      stateSlice: StateSlice,
      action: PayloadAction<
        any,
        string,
        {
          arg: any;
          requestId: string;
          requestStatus: "fulfilled";
        },
        never
      >
    ): void;
  } =>
  (stateSlice, action): void => {
    // fullfilled
    const request = initStateRequestId(stateSlice, requestType, action.meta.requestId);
    request.state = 'loaded';
    sliceMap(stateSlice.requests[requestType], keep);
  };

export const requestRejectedReducer =
  (
    requestType: string,
    keep: number
  ): {
    (
      stateSlice: StateSlice,
      action: PayloadAction<
        any,
        string,
        {
          arg: any;
          requestId: string;
          requestStatus: "rejected";
          aborted: boolean;
          condition: boolean;
        } & (
          | {
              rejectedWithValue: true;
            }
          | ({
              rejectedWithValue: false;
            } & {})
        ),
        SerializedError
      >
    ): void;
  } =>
  (stateSlice, action): void => {
    // rejected
    const request = initStateRequestId(stateSlice, requestType, action.meta.requestId);
    request.state = 'error';
    if (action.meta.aborted) {
      request.state = "aborted";
    }
    request.error = action.error;
    sliceMap(stateSlice.requests[requestType], keep);
  };

export const requestPendingReducer =
  (
    requestType: string,
    keep: number
  ): {
    (
      stateSlice: StateSlice,
      action: PayloadAction<
        any,
        string,
        {
          arg: any;
          requestId: string;
          requestStatus: "pending";
        },
        never
      >
    ): void;
  } =>
  (stateSlice, action): void => {
    // pending
    const request = initStateRequestId(stateSlice, requestType, action.meta.requestId);
    request.state = 'loading';
    sliceMap(stateSlice.requests[requestType], keep);
  };

export const requestReducers = (requestType: string, keep: number) => {
  return {
    pending: requestPendingReducer(requestType, keep),
    fulfilled: requestFullfilledReducer(requestType, keep),
    rejected: requestRejectedReducer(requestType, keep),
  };
};

type AnyState = any;
type StateWithRequests = {
  requests: MapType<MapType<RequestInformation>>;
};

type StateSliceSelector<S extends StateWithRequests> = {
  (root: AnyState): S;
};

// selectors
export const createLastRequestSelector = <S extends StateWithRequests>(
  requestType: string,
  stateSliceSelector: StateSliceSelector<S>
) =>
  createSelector(stateSliceSelector, ({ requests: rs }) =>
    rs[requestType]
      ? rs[requestType][Object.keys(rs[requestType]).pop() as string]
      : null
  );

export const createRequestErrorSelector = <S extends StateWithRequests>(
  requestType: string,
  stateSliceSelector: StateSliceSelector<S>
) =>
  createSelector(
    createLastRequestSelector(requestType, stateSliceSelector),
    r => (r ? r.error : null)
  );
export const createRequestStateSelector = <S extends StateWithRequests>(
  requestType: string,
  stateSliceSelector: StateSliceSelector<S>
) =>
  createSelector(
    createLastRequestSelector(requestType, stateSliceSelector),
    r => (r ? r.state : "none")
  );

export const createRequestSelectors = <S extends StateWithRequests>(
  requestType: string,
  stateSliceSelector: StateSliceSelector<S>
) => ({
  lastSelector: createLastRequestSelector(requestType, stateSliceSelector),
  errorSelector: createRequestErrorSelector(requestType, stateSliceSelector),
  stateSelector: createRequestStateSelector(requestType, stateSliceSelector),
});

