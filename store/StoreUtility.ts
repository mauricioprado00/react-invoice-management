import { PayloadAction, SerializedError } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { MapType } from "models/UtilityModels";

export type RequestState = "loading" | "loaded" | "error" | "aborted";
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
          arg: void;
          requestId: string;
          requestStatus: "fulfilled";
        },
        never
      >
    ): void;
  } =>
  (stateSlice, action): void => {
    let request = stateSlice.requests[requestType][action.meta.requestId];
    if (request) {
      request.state = "loaded";
    }
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
          arg: void;
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
    let request = stateSlice.requests[requestType][action.meta.requestId];
    if (request) {
      request.state = "error";
      if (action.meta.aborted) {
        request.state = "aborted";
      }
      request.error = action.error;
    }
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
          arg: void;
          requestId: string;
          requestStatus: "pending";
        },
        never
      >
    ): void;
  } =>
  (stateSlice, action): void => {
    if (stateSlice.requests === undefined) {
      stateSlice.requests = [];
    }
    if (stateSlice.requests[requestType] === undefined) {
      stateSlice.requests[requestType] = {};
    }
    stateSlice.requests[requestType][action.meta.requestId] = {
      time: Date.now(),
      state: "loading",
    };
    sliceMap(stateSlice.requests[requestType], keep);
  };

export const requestReducers = (requestType: string, keep: number) => {
  return {
    pending: requestPendingReducer(requestType, keep),
    fulfilled: requestFullfilledReducer(requestType, keep),
    rejected: requestRejectedReducer(requestType, keep),
  };
};
