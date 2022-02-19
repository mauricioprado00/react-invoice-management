import { combineReducers } from "redux"
import clientsReducer from "./ClientSlice";

const entitiesReducer = combineReducers({
    client: clientsReducer
});

export type EntitiesState = ReturnType<typeof entitiesReducer>

export default entitiesReducer;
