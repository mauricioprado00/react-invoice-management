import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Client, ClientWithTotals, ClientWithTotalsList } from "models/Client";
import { createSelector } from "reselect";
import { AppThunkAPI } from "./configureStore";
import { RootState } from "./RootSlice";


export type ClientsState = {
  list: ClientWithTotalsList,
  requestState: string,
  lastFetch: number|null
}

const initialState: ClientsState = {
    list: [],
    requestState: "loading",
    lastFetch: null,
}

const findClientIndex = (clients:ClientWithTotalsList, id:string) =>
  clients.findIndex((client:Client) => client.id === id);
const findClient = (clients:ClientWithTotalsList, id:string) => clients[findClientIndex(clients, id)];


export const loadClients = createAsyncThunk<void, void, AppThunkAPI>('todos/fetchTodos', async (arg, thunkAPI) => {
  
  thunkAPI.extra.serviceApi.something()
  console.log("loadClients", {arg, thunkAPI});

})

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
});

export const {
  clientAdded,
  clientRemoved,
  clientsReceived,
} = slice.actions;

export default slice.reducer;

// action creators

const clientsSelector = (state:RootState) : ClientsState => state.entities.clients;
export const isMostValuableClient = (client:ClientWithTotals) => client.totalBilled > 5000;

// selectors
export const getMostValuableClientsSelector = createSelector(
  clientsSelector,
  clients => clients.list.filter(isMostValuableClient)
);

export const getClientsByCompanyNameSelector = (companyName:string) =>
  createSelector(clientsSelector, clients =>
    clients.list.filter(client => client.companyDetails.name === companyName)
  );
