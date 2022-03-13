import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ClientInvoice, ClientInvoiceList } from "models/Invoice";
import { MapType } from "models/UtilityModels";
import { createSelector } from "reselect";
import { AppThunkAPI } from "./configureStore";
import { RootState } from "./RootSlice";
import {
  createRequestSelectors,
  RequestInformation,
  requestReducers,
} from "./RequestUtility";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { userLoggedIn, userLoggedOut } from "./UserSlice";
import { useThunkDispatch } from "hooks/use-thunk-dispatch";

type InvoiceStatus = "initial" | "began_fetching" | "loaded";
let loadInvoiceBegan = false;

export type ClientInvoicesState = {
  list: MapType<ClientInvoice>;
  requests: MapType<MapType<RequestInformation>>;
  status: InvoiceStatus;
};

const initialState: ClientInvoicesState = {
  list: {},
  // group all of these into a new attribute
  requests: {},
  status: "initial",
};

export type UpsertInvoiceResult = {
  clientInvoice: ClientInvoice;
  success?: boolean;
};

const findClientInvoiceIndex = (
  clientInvoices: ClientInvoiceList,
  id: string
) =>
  clientInvoices.findIndex(
    (clientInvoice: ClientInvoice) => clientInvoice.invoice.id === id
  );
const findClientInvoice = (clientInvoices: ClientInvoiceList, id: string) =>
  clientInvoices[findClientInvoiceIndex(clientInvoices, id)];

export const upsertInvoice = createAsyncThunk<
  // Return type of the payload creator
  UpsertInvoiceResult,
  // First argument to the payload creator
  ClientInvoice,
  AppThunkAPI
>(
  "invoice/add",
  async (clientInvoice, thunkAPI): Promise<UpsertInvoiceResult> => {
    const following = clientInvoice.invoice.id ? updated : added;
    const result = thunkAPI.extra.serviceApi.upsertInvoice(
      clientInvoice,
      clientInvoice => thunkAPI.dispatch(following(clientInvoice))
    );
    thunkAPI.signal.addEventListener("abort", result.abort);
    result.promise.catch(errorMessage =>
      thunkAPI.rejectWithValue(errorMessage)
    );
    return {
      clientInvoice: await result.promise,
      success: true,
    };
  }
);

export const loadClientInvoices = createAsyncThunk<
  // Return type of the payload creator
  ClientInvoiceList,
  // First argument to the payload creator
  void,
  AppThunkAPI
>("invoice/load", async (arg, thunkAPI): Promise<ClientInvoiceList> => {
  thunkAPI.dispatch(requested());
  const result = thunkAPI.extra.serviceApi.getInvoices(clientInvoices =>
    thunkAPI.dispatch(received(clientInvoices))
  );
  thunkAPI.signal.addEventListener("abort", result.abort);
  const clientInvoices = await result.promise;
  return clientInvoices;
});

const slice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    requested: state => {
      state.status = "began_fetching";
    },
    received: (state, action: PayloadAction<ClientInvoice[]>) => {
      action.payload.forEach(
        clientInvoice => (state.list[clientInvoice.invoice.id] = clientInvoice)
      );
      state.status = "loaded";
    },
    updated: (state, action: PayloadAction<ClientInvoice>) => {
      state.list[action.payload.invoice.id] = {
        ...action.payload,
      };
    },
    added: (state, action: PayloadAction<ClientInvoice>) => {
      state.list[action.payload.invoice.id] = { ...action.payload };
    },
    removed: (state, action: PayloadAction<ClientInvoice>) => {
      const { id } = action.payload.invoice;
      delete state.list[id];
    },
  },
  extraReducers: builder => {
    builder.addCase(userLoggedIn, () => {
      loadInvoiceBegan = false;
    });
    builder.addCase(userLoggedOut, state => {
      return { ...initialState };
    });

    {
      const { pending, fulfilled, rejected } = requestReducers(
        "loadClientInvoices",
        5
      );
      builder.addCase(loadClientInvoices.pending, pending);
      builder.addCase(loadClientInvoices.fulfilled, fulfilled);
      builder.addCase(loadClientInvoices.rejected, rejected);
    }
    {
      const { pending, fulfilled, rejected } = requestReducers(
        "upsertInvoice",
        5
      );
      builder.addCase(upsertInvoice.pending, pending);
      builder.addCase(upsertInvoice.fulfilled, fulfilled);
      builder.addCase(upsertInvoice.rejected, rejected);
    }

  },
});

export const { added, updated, removed, received, requested } = slice.actions;

export default slice.reducer;

// utility functions
export const clientInvoiceListToOptions = (
  clientInvoiceList: ClientInvoiceList
) =>
  clientInvoiceList.map(clientInvoice => ({
    value: clientInvoice.invoice.id,
    label: clientInvoice.invoice.invoice_number,
  }));

// business logic
export const isMostValuableClientInvoice = (clientInvoice: ClientInvoice) =>
  clientInvoice.invoice.value > 5000;

// selectors
export const clientInvoiceSliceSelector = (
  state: RootState
): ClientInvoicesState => state.entities.invoice;

export const {
  lastSelector: clientInvoiceSliceLastRequestSelector,
  errorSelector: loadClientInvoiceErrorSelector,
  stateSelector: loadClientInvoiceStateSelector,
} = createRequestSelectors("loadClientInvoices", clientInvoiceSliceSelector);

export const {
  lastSelector: upsertInvoiceLastRequestSelector,
  errorSelector: upsertInvoiceErrorSelector,
  stateSelector: upsertInvoiceStateSelector,
} = createRequestSelectors("upsertInvoice", clientInvoiceSliceSelector);

export const clientInvoiceListSelector = createSelector(
  clientInvoiceSliceSelector,
  clientInvoiceSlice => Object.values(clientInvoiceSlice.list)
);

export const clientInvoiceCountSelector = createSelector(
  clientInvoiceListSelector,
  invoiceList => invoiceList.length
);

export const clientInvoiceSumSelector = createSelector(
  clientInvoiceListSelector,
  invoiceList =>
    invoiceList.reduce((prev, invoice) => prev + invoice.invoice.value, 0)
);

export const getMostValuableClientInvoicesSelector = createSelector(
  clientInvoiceListSelector,
  clientInvoiceList => clientInvoiceList.filter(isMostValuableClientInvoice)
);

export const getClientInvoicesByCompanyNameSelector = (companyName: string) =>
  createSelector(clientInvoiceListSelector, clientInvoiceList =>
    clientInvoiceList.filter(
      clientInvoice => clientInvoice.client.companyDetails.name === companyName
    )
  );

export const getClientInvoiceOptionsSelector = createSelector(
  clientInvoiceListSelector,
  clientList => clientInvoiceListToOptions(clientList)
);

export const clientInvoiceStatusSelector = createSelector(
  clientInvoiceSliceSelector,
  clientInvoiceSlice => clientInvoiceSlice.status
);

// hooks
const useInvoiceSelector = <TState, TSelected>(
  selector: (state: TState) => TSelected
) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (!loadInvoiceBegan) {
      loadInvoiceBegan = true;
      dispatch(loadClientInvoices());
    }
  }, [dispatch]);
  return useSelector<TState, TSelected>(selector);
};

export const useClientInvoiceOptions = () =>
  useSelector(getClientInvoiceOptionsSelector);
export const useInvoiceSlice = () => useSelector(clientInvoiceSliceSelector);
export const useInvoiceList = () =>
  useInvoiceSelector(clientInvoiceListSelector);
export const useLoadInvoiceError = () =>
  useSelector(loadClientInvoiceErrorSelector);
const useLoadInvoiceState = () => useSelector(loadClientInvoiceStateSelector);
export const useInvoiceLoading = () => {
  const state = useLoadInvoiceState();
  return state === "none" || state === "loading";
};
export const useInvoiceStatus = () => useSelector(clientInvoiceStatusSelector);

export const useInvoiceCount = () =>
  useInvoiceSelector(clientInvoiceCountSelector);
export const useInvoiceSum = () => useInvoiceSelector(clientInvoiceSumSelector);
export const useUpsertInvoice = () => {
  const dispatch = useThunkDispatch();
  return (clientInvoice: ClientInvoice) => dispatch(upsertInvoice(clientInvoice));
};
export const useUpsertInvoiceLastRequest = () =>
  useInvoiceSelector(upsertInvoiceLastRequestSelector);
export const useUpsertInvoiceError = () =>
  useInvoiceSelector(upsertInvoiceErrorSelector);
export const useUpsertInvoiceState = () =>
  useInvoiceSelector(upsertInvoiceStateSelector);
