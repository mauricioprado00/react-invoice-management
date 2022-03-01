import { combineReducers } from "redux"
import entitiesReducer from './EntitiesSlice'
import RouteSlice from "./RouteSlice";
import userReducer from './UserSlice'

const rootReducer = combineReducers({
	entities: entitiesReducer,
	user: userReducer,
	route: RouteSlice
});

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;
