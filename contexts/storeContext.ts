import { createContext } from "react";
import { Store } from "store/configureStore";


type StoreContextType = ReturnType<Store> | null
const StoreContext = createContext<StoreContextType>(null);

export default StoreContext;
