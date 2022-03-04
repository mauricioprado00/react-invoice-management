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

export type ClientInvoicesState = {
  list: ClientInvoiceList;
  requests: MapType<MapType<RequestInformation>>;
  init: boolean;
};

const initialState: ClientInvoicesState = {
  list: [],
  // group all of these into a new attribute
  requests: {},
  init: false,
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
  const result = thunkAPI.extra.serviceApi.getInvoices(clientInvoices =>
    thunkAPI.dispatch(clientInvoicesReceived(clientInvoices))
  );
  thunkAPI.signal.addEventListener("abort", result.abort);
  const clientInvoices = await result.promise;
  return clientInvoices;
});

const slice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    clientInvoicesReceived: (clientInvoice, action) => {
      clientInvoice.list = action.payload;
      clientInvoice.init = true;
    },
    clientInvoiceAdded: (clientInvoice, action) => {
      clientInvoice.list.push(action.payload);
    },
    clientInvoiceRemoved: (clientInvoice, action) => {
      const { id } = action.payload;
      const index = findClientInvoiceIndex(clientInvoice.list, id);
      clientInvoice.list.splice(index, 1);
    },
  },
  extraReducers: builder => {
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
  clientInvoiceAdded,
  clientInvoiceRemoved,
  clientInvoicesReceived,
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

export const clientInvoiceInitSelector = createSelector(
  clientInvoiceSliceSelector,
  clientInvoiceSlice => clientInvoiceSlice.init
);

// hooks
const useInvoiceSelector = <TState, TSelected>(
  selector: (state: TState) => TSelected
) => {
  const init = useInvoiceInit();
  const dispatch = useDispatch();
  useEffect(() => {
    if (init === false) {
      dispatch(loadClientInvoices());
    }
  }, [init, dispatch]);
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
export const useInvoiceInit = () => useSelector(clientInvoiceInitSelector);

export const useInvoiceCount = () =>
  useInvoiceSelector(clientInvoiceCountSelector);
export const useInvoiceSum = () => useInvoiceSelector(clientInvoiceSumSelector);
