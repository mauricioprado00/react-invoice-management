import {
  createAsyncThunk,
  createSlice,
  SerializedError,
} from "@reduxjs/toolkit";
import { Client, ClientWithTotals, ClientWithTotalsList } from "models/Client";
import { createSelector } from "reselect";
import { AppThunkAPI } from "./configureStore";
import { RootState } from "./RootSlice";

export type RequestState = "loading" | "loaded" | "error" | "aborted";
export type ClientsState = {
  list: ClientWithTotalsList;
  loadClientsState: RequestState;
  loadClientsError: SerializedError | null;
  lastFetch: number | null;
};
const initialState: ClientsState = {
  list: [],
  loadClientsState: "loading",
  loadClientsError: null,
  lastFetch: null,
};

const findClientIndex = (clients: ClientWithTotalsList, id: string) =>
  clients.findIndex((client: Client) => client.id === id);
const findClient = (clients: ClientWithTotalsList, id: string) =>
  clients[findClientIndex(clients, id)];

export const loadClients = createAsyncThunk<
  // Return type of the payload creator
  ClientWithTotalsList,
  // First argument to the payload creator
  void,
  AppThunkAPI
>("client/load", async (arg, thunkAPI): Promise<ClientWithTotalsList> => {
  const result = thunkAPI.extra.serviceApi.getClients(clients =>
    thunkAPI.dispatch(clientsReceived(clients))
  );
  thunkAPI.signal.addEventListener("abort", result.abort);
  const clients = await result.promise;
  return clients;
});

const slice = createSlice({
  name: "client",
  initialState,
  reducers: {
    clientsReceived: (client, action) => {
      client.list = action.payload;
      client.lastFetch = Date.now();
    },
    clientAdded: (client, action) => {
      client.list.push(action.payload);
    },
    clientRemoved: (client, action) => {
      const { id } = action.payload;
      const index = findClientIndex(client.list, id);
      client.list.splice(index, 1);
    },
  },
  extraReducers: builder => {
    builder.addCase(loadClients.pending, (client, action) => {
      client.loadClientsState = "loading";
      client.loadClientsError = null;
    });
    builder.addCase(loadClients.fulfilled, (client, action) => {
      client.loadClientsState = "loaded";
      client.loadClientsError = null;
    });
    builder.addCase(loadClients.rejected, (client, action) => {
      client.loadClientsState = "error";
      if (action.meta.aborted) {
        client.loadClientsState = "aborted";
      }
      client.loadClientsError = action.error;
    });
  },
});

export const { clientAdded, clientRemoved, clientsReceived } = slice.actions;

export default slice.reducer;

// business logic
export const isMostValuableClient = (client: ClientWithTotals) =>
  client.totalBilled > 5000;

// selectors
export const clientSliceSelector = (state: RootState): ClientsState =>
  state.entities.client;

export const getMostValuableClientsSelector = createSelector(
  clientSliceSelector,
  clientSlice => clientSlice.list.filter(isMostValuableClient)
);

export const getClientsByCompanyNameSelector = (companyName: string) =>
  createSelector(clientSliceSelector, clientSlice =>
    clientSlice.list.filter(
      client => client.companyDetails.name === companyName
    )
  );
