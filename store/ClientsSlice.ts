import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Client, ClientWithTotals, ClientWithTotalsList } from "models/Client";
import { createSelector } from "reselect";
import { AppThunkAPI } from "./configureStore";
import { RootState } from "./RootSlice";

export type RequestState = "loading" | "loaded" | "error" | "aborted"
export type ClientsState = {
  list: ClientWithTotalsList;
  loadClientsState: RequestState;
  lastFetch: number | null;
};
const initialState: ClientsState = {
  list: [],
  loadClientsState: "loading",
  lastFetch: null,
};

const findClientIndex = (clients: ClientWithTotalsList, id: string) =>
  clients.findIndex((client: Client) => client.id === id);
const findClient = (clients: ClientWithTotalsList, id: string) =>
  clients[findClientIndex(clients, id)];

export const loadClients = createAsyncThunk<
  // Return type of the payload creator
  void,
  // First argument to the payload creator
  void,
  AppThunkAPI
>("clients/loadClients", async (arg, thunkAPI) => {
  const result = thunkAPI.extra.serviceApi.getClients(clients =>
    thunkAPI.dispatch(clientsReceived(clients))
  );
  const clients = await result.promise;
});

const slice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    clientsReceived: (clients, action) => {
      clients.list = action.payload;
      clients.lastFetch = Date.now();
    },
    clientAdded: (clients, action) => {
      clients.list.push(action.payload);
    },
    clientRemoved: (clients, action) => {
      const { id } = action.payload;
      const index = findClientIndex(clients.list, id);
      clients.list.splice(index, 1);
    },
  },
  extraReducers: builder => {
    builder.addCase(loadClients.pending, (clients, action) => {
      clients.loadClientsState = "loading"
    })
    builder.addCase(loadClients.fulfilled, (clients, action) => {
      clients.loadClientsState = "loaded"
    })
  }
});

export const { clientAdded, clientRemoved, clientsReceived } = slice.actions;

export default slice.reducer;

// action creators

export const clientsSelector = (state: RootState): ClientsState =>
  state.entities.clients;
export const isMostValuableClient = (client: ClientWithTotals) =>
  client.totalBilled > 5000;

// selectors
export const getMostValuableClientsSelector = createSelector(
  clientsSelector,
  clients => clients.list.filter(isMostValuableClient)
);

export const getClientsByCompanyNameSelector = (companyName: string) =>
  createSelector(clientsSelector, clients =>
    clients.list.filter(client => client.companyDetails.name === companyName)
  );
