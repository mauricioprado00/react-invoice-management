import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Client, ClientWithTotals, ClientWithTotalsList } from "models/Client";
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


export const addClient = createAsyncThunk<
  // Return type of the payload creator
  Client,
  // First argument to the payload creator
  Client,
  AppThunkAPI
>("client/add", async (client, thunkAPI): Promise<Client> => {
  const result = thunkAPI.extra.serviceApi.addClient(client, client =>
    thunkAPI.dispatch(clientAdded(client))
  );
  thunkAPI.signal.addEventListener("abort", result.abort);
  result.promise.catch((errorMessage) => thunkAPI.rejectWithValue(errorMessage))
  const savedClient = await result.promise;
  return savedClient;
});

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
  result.promise.catch((errorMessage) => thunkAPI.rejectWithValue(errorMessage))
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
      client.list.push({...action.payload, totalBilled: action.payload.totalBilled || 0});
    },
    clientRemoved: (client, action) => {
      const { id } = action.payload;
      const index = findClientIndex(client.list, id);
      client.list.splice(index, 1);
    },
  },
  extraReducers: builder => {
    {
      const { pending, fulfilled, rejected } = requestReducers("loadClients", 5);
      builder.addCase(loadClients.pending, pending);
      builder.addCase(loadClients.fulfilled, fulfilled);
      builder.addCase(loadClients.rejected, rejected);
    }
    {
      const { pending, fulfilled, rejected } = requestReducers("addClient", 5);
      builder.addCase(addClient.pending, pending);
      builder.addCase(addClient.fulfilled, fulfilled);
      builder.addCase(addClient.rejected, rejected);
    }
  },
});

export const { clientAdded, clientRemoved, clientsReceived } = slice.actions;

export default slice.reducer;

// utility functions
export const clientListToOptions = (clients: ClientWithTotalsList) =>
  clients.map(client => ({ value: client.id.toString(), label: client.name }));

// business logic
export const isMostValuableClient = (client: ClientWithTotals) =>
  client.totalBilled > 5000;

// selectors
export const clientSliceSelector = (state: RootState): ClientsState =>
  state.entities.client;

export const {
  lastSelector: clientSliceLastRequestSelector,
  errorSelector: loadClientErrorSelector,
  stateSelector: loadClientStateSelector,
} = createRequestSelectors("loadClients", clientSliceSelector);

export const {
  lastSelector: addClientLastRequestSelector,
  errorSelector: addClientErrorSelector,
  stateSelector: addClientStateSelector,
} = createRequestSelectors("addClient", clientSliceSelector);

export const clientListSelector = createSelector(
  clientSliceSelector,
  clientSlice => clientSlice.list
);

export const getMostValuableClientsSelector = createSelector(
  clientListSelector,
  clientList => clientList.filter(isMostValuableClient)
);

export const getClientsByCompanyNameSelector = (companyName: string) =>
  createSelector(clientListSelector, clientList =>
    clientList.filter(client => client.companyDetails.name === companyName)
  );

export const getClientOptionsSelector = createSelector(
  clientListSelector,
  clientList => clientListToOptions(clientList)
);

// hooks
export const useClientOptions = () => useSelector(getClientOptionsSelector);
export const useClientSlice = () => useSelector(clientSliceSelector);
export const useClientList = () => useSelector(clientListSelector);
export const useLoadClientError = () => useSelector(loadClientErrorSelector);
export const useLoadClientState = () => useSelector(loadClientStateSelector);
export const useAddClient = () => {
  const dispatch = useDispatch();
  return  (client:Client) => {
    dispatch(addClient(client))
  };
}
export const useAddClientLastRequest = () => useSelector(addClientLastRequestSelector);
export const useAddClientError = () => useSelector(addClientErrorSelector);
export const useAddClientState = () => useSelector(addClientStateSelector);
