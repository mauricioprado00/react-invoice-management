import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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
import { userLoggedOut } from "./UserSlice";

type InvoiceStatus = "initial" | "began_fetching" | "loaded";

export type ClientInvoicesState = {
  list: ClientInvoiceList;
  requests: MapType<MapType<RequestInformation>>;
  status: InvoiceStatus;
};

const initialState: ClientInvoicesState = {
  list: [],
  // group all of these into a new attribute
  requests: {},
  status: "initial",
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
    requested: (clientInvoice) => {
      clientInvoice.status = 'began_fetching';
    },
    received: (clientInvoice, action) => {
      clientInvoice.list = action.payload;
      clientInvoice.status = 'loaded';
    },
    added: (clientInvoice, action) => {
      clientInvoice.list.push(action.payload);
    },
    removed: (clientInvoice, action) => {
      const { id } = action.payload;
      const index = findClientInvoiceIndex(clientInvoice.list, id);
      clientInvoice.list.splice(index, 1);
    },
  },
  extraReducers: builder => {
    builder.addCase(userLoggedOut, (state) => {
      return {...initialState}
    });
    const { pending, fulfilled, rejected } = requestReducers(
      "loadClientInvoices",
      5
    );
    builder.addCase(loadClientInvoices.pending, pending);
    builder.addCase(loadClientInvoices.fulfilled, fulfilled);
    builder.addCase(loadClientInvoices.rejected, rejected);
  },
});

export const {
  added,
  removed,
  received,
  requested,
} = slice.actions;

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

export const clientInvoiceListSelector = createSelector(
  clientInvoiceSliceSelector,
  clientInvoiceSlice => clientInvoiceSlice.list
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
let loadInvoiceBegan = false;
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
export const useInvoiceList = () => useSelector(clientInvoiceListSelector);
export const useLoadInvoiceError = () =>
  useSelector(loadClientInvoiceErrorSelector);
export const useLoadInvoiceState = () =>
  useSelector(loadClientInvoiceStateSelector);
export const useInvoiceStatus = () => useSelector(clientInvoiceStatusSelector);

export const useInvoiceCount = () =>
  useInvoiceSelector(clientInvoiceCountSelector);
export const useInvoiceSum = () => useInvoiceSelector(clientInvoiceSumSelector);
