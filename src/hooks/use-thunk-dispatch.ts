import { PayloadAction, SerializedError } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

type AnyThunk = (...args:any) => any
export const useThunkDispatch = () => {
    const dispatch = useDispatch();
    return <T extends AnyThunk>(thunk:T):ReturnType<T> => { return dispatch(thunk) as ReturnType<T>;}
}

export const isFullfilledThunk = <R,A>(r:PayloadAction<R, string, {
    arg: A;
    requestId: string;
    requestStatus: "fulfilled";
}, never> | PayloadAction<unknown, string, {
    arg: A;
    requestId: string;
    requestStatus: "rejected";
    aborted: boolean;
    condition: boolean;
} & ({
    rejectedWithValue: true;
} | ({
    rejectedWithValue: false;
} & {})), SerializedError>):r is PayloadAction<R, string, {
    arg: A;
    requestId: string;
    requestStatus: "fulfilled";
}, never> => {

    return !('error' in r);
}
