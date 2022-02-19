import { combineReducers } from "redux"
import entitiesReducer from './EntitiesSlice'

const rootReducer = combineReducers({
	entities: entitiesReducer,
});

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;
