import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Client, ClientWithTotals, ClientWithTotalsList } from "models/Client";
import { MapType } from "models/UtilityModels";
import { createSelector } from "reselect";
import { AppThunkAPI } from "./configureStore";
import { RootState } from "./RootSlice";
import {
  requestFullfilledReducer,
  RequestInformation,
  requestPendingReducer,
  requestRejectedReducer,
} from "./StoreUtility";

export type ClientsState = {
  list: ClientWithTotalsList;
  requests: MapType<MapType<RequestInformation>>;
};

const initialState: ClientsState = {
  list: [],
  // group all of these into a new attribute
  requests: {},
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
    builder.addCase(
      loadClients.pending,
      requestPendingReducer("loadClients", 5)
    );
    builder.addCase(
      loadClients.fulfilled,
      requestFullfilledReducer("loadClients", 5)
    );
    builder.addCase(
      loadClients.rejected,
      requestRejectedReducer("loadClients", 5)
    );
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

export const clientSliceLastRequestSelector = createSelector(
  clientSliceSelector,
  ({ requests: rs }) =>
    rs.loadClients
      ? rs.loadClients[Object.keys(rs.loadClients).pop() as string]
      : null
);

export const loadClientErrorSelector = createSelector(
  clientSliceLastRequestSelector,
  r => (r ? r.error : null)
);

export const loadClientStateSelector = createSelector(
  clientSliceLastRequestSelector,
  r => (r ? r.state : "loading")
);

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