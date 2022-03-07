import { useDispatch } from "react-redux";

type Error = {
    message: string
}
type ErrorPayloadAction = {
    error?: Error
}
type CustomPayload<T> = {
    payload: T
}
type AnyThunk = (...args:any) => any
type ThunkResult<T extends AnyThunk, P> = ReturnType<T> & Promise<CustomPayload<P>> & 
    Promise<ErrorPayloadAction>
export const useThunkDispatch = <P>() => {
    const dispatch = useDispatch();
    return <T extends AnyThunk,>(thunk:T):ThunkResult<T, P> => { return dispatch(thunk) as ThunkResult<T, P>;}
}
