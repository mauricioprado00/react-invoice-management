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

export type ClientInvoicesState = {
  list: ClientInvoiceList;
  requests: MapType<MapType<RequestInformation>>;
};

const initialState: ClientInvoicesState = {
  list: [],
  // group all of these into a new attribute
  requests: {},
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
