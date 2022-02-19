import { combineReducers } from "redux"
import clientsReducer from "./ClientSlice";

const entitiesReducer = combineReducers({
    clients: clientsReducer
});

export type EntitiesState = ReturnType<typeof entitiesReducer>

export default entitiesReducer;
