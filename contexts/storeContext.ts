import { createContext } from "react";
import { RootState } from "store/RootSlice";


type StoreContextType = RootState | null
const StoreContext = createContext<StoreContextType>(null);

export default StoreContext;
