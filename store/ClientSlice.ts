import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AnyClient,
  Client,
  ClientWithTotals,
  ClientWithTotalsList,
} from "models/Client";
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

export type ClientsState = {
  list: MapType<ClientWithTotals>;
  requests: MapType<MapType<RequestInformation>>;
  init: boolean;
};

const initialState: ClientsState = {
  list: {},
  // group all of these into a new attribute
  requests: {},
  init: false,
};

export type UpsertClientResult = {
  client: Client;
  success?: boolean;
};

const findClientIndex = (clients: ClientWithTotalsList, id: string) =>
  clients.findIndex((client: Client) => client.id === id);
const findClient = (clients: ClientWithTotalsList, id: string) =>
  clients[findClientIndex(clients, id)];

export const upsertClient = createAsyncThunk<
  // Return type of the payload creator
  UpsertClientResult,
  // First argument to the payload creator
  Client,
  AppThunkAPI
>("client/add", async (client, thunkAPI): Promise<UpsertClientResult> => {
  const following = client.id ? clientUpdated : clientAdded;
  const result = thunkAPI.extra.serviceApi.upsertClient(client, client =>
    thunkAPI.dispatch(following({ totalBilled: 0, ...client }))
  );
  thunkAPI.signal.addEventListener("abort", result.abort);
  result.promise.catch(errorMessage => thunkAPI.rejectWithValue(errorMessage));
  return {
    client: await result.promise,
    success: true,
  };
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
  result.promise.catch(errorMessage => thunkAPI.rejectWithValue(errorMessage));
  const clients = await result.promise;
  return clients;
});

const slice = createSlice({
  name: "client",
  initialState,
  reducers: {
    clientsReceived: (state, action: PayloadAction<ClientWithTotals[]>) => {
      action.payload.forEach(client => (state.list[client.id] = client));
      state.init = true;
    },
    clientUpdated: (state, action: PayloadAction<ClientWithTotals>) => {
      state.list[action.payload.id] = action.payload;
    },
    clientAdded: (state, action: PayloadAction<ClientWithTotals>) => {
      state.list[action.payload.id] = action.payload;
    },
    clientRemoved: (state, action: PayloadAction<ClientWithTotals>) => {
      const { id } = action.payload;
      delete state.list[id];
    },
  },
  extraReducers: builder => {
    {
      const { pending, fulfilled, rejected } = requestReducers(
        "loadClients",
        5
      );
      builder.addCase(loadClients.pending, pending);
      builder.addCase(loadClients.fulfilled, fulfilled);
      builder.addCase(loadClients.rejected, rejected);
    }
    {
      const { pending, fulfilled, rejected } = requestReducers(
        "upsertClient",
        5
      );
      builder.addCase(upsertClient.pending, pending);
      builder.addCase(upsertClient.fulfilled, fulfilled);
      builder.addCase(upsertClient.rejected, rejected);
    }
  },
});

export const { clientAdded, clientUpdated, clientRemoved, clientsReceived } =
  slice.actions;

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
  lastSelector: upsertClientLastRequestSelector,
  errorSelector: upsertClientErrorSelector,
  stateSelector: upsertClientStateSelector,
} = createRequestSelectors("upsertClient", clientSliceSelector);

export const clientListSelector = createSelector(
  clientSliceSelector,
  clientSlice => Object.values(clientSlice.list)
);

export const getMostValuableClientsSelector = createSelector(
  clientListSelector,
  clientList => clientList.filter(isMostValuableClient)
);

export const getClientsByCompanyNameSelector = (companyName: string) =>
  createSelector(clientListSelector, clientList =>
    clientList.filter(client => client.companyDetails.name === companyName)
  );

export const clientByIdSelector = (id: string|null) =>
  createSelector(clientListSelector, clientList =>
    clientList.filter(client => client.id === id).pop() || null
  );

export const getClientOptionsSelector = createSelector(
  clientListSelector,
  clientList => clientListToOptions(clientList)
);

export const clientInitSelector = createSelector(
  clientSliceSelector,
  clientSlice => clientSlice.init
);

// hooks
const useClientSelector = <TState, TSelected>(
  selector: (state: TState) => TSelected
) => {
  const init = useClientInit();
  const dispatch = useDispatch();
  useEffect(() => {
    if (init === false) {
      dispatch(loadClients());
    }
  }, [init, dispatch]);
  return useSelector<TState, TSelected>(selector);
};

export const useClientOptions = () =>
  useClientSelector(getClientOptionsSelector);
export const useClientSlice = () => useSelector(clientSliceSelector);
export const useClientList = () => useClientSelector(clientListSelector);
export const useLoadClientError = () => useSelector(loadClientErrorSelector);
export const useLoadClientState = () => useSelector(loadClientStateSelector);
export const useClientInit = () => useSelector(clientInitSelector);
export const useClientById = (id:string|null) => useSelector(clientByIdSelector(id));
export const useUpsertClient = () => {
  const dispatch = useDispatch();
  return (client: Client) => dispatch(upsertClient(client));
};
export const useUpsertClientLastRequest = () =>
  useClientSelector(upsertClientLastRequestSelector);
export const useUpsertClientError = () =>
  useClientSelector(upsertClientErrorSelector);
export const useUpsertClientState = () =>
  useClientSelector(upsertClientStateSelector);
