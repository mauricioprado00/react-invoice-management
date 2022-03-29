import { combineReducers } from "redux"
import clientsReducer from "./ClientSlice";
import invoiceReducer from "./InvoiceSlice";

const entitiesReducer = combineReducers({
    client: clientsReducer,
    invoice: invoiceReducer,
});

export type EntitiesState = ReturnType<typeof entitiesReducer>

export default entitiesReducer;
