import { combineReducers } from "redux"
import entitiesReducer from './EntitiesSlice'
import userReducer from './UserSlice'

const rootReducer = combineReducers({
	entities: entitiesReducer,
	user: userReducer
});

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;
