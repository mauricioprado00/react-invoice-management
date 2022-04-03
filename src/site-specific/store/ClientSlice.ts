import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Client, ClientList, ClientWithTotals, ClientWithTotalsList } from "site-specific/models/Client";
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
import { useEffect, useMemo } from "react";
import { userLoggedIn, userLoggedOut } from "./UserSlice";
import { useThunkDispatch } from "hooks/use-thunk-dispatch";
import {
  added as invoiceAdded,
  updated as invoiceUpdated,
  beforeUpdate as beforeUpdateInvoice,
} from "./InvoiceSlice";
import { ClientInvoice } from "site-specific/models/Invoice";
import { ClientListingArgsU, ClientListingResponse } from "api/apiclient";
import { Md5 } from "md5-typescript";
import { WritableDraft } from "immer/dist/internal";

type ClientStatus = "initial" | "began_fetching" | "loaded";
let loadClientBegan = false;

export type FilteredClientsList = {
  args: ClientListingArgsU;
  list: ClientWithTotalsList;
  loaded: boolean;
  total: number;
};
export type ClientsState = {
  list: MapType<ClientWithTotals>;
  filtered: MapType<FilteredClientsList>;
  requests: MapType<MapType<RequestInformation>>;
  status: ClientStatus;
};

const initialState: ClientsState = {
  list: {},
  filtered: {},
  // group all of these into a new attribute
  requests: {},
  status: "initial",
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
>("client/add", (client, thunkAPI): Promise<UpsertClientResult> => {
  const following = client.id ? updated : added;
  const result = thunkAPI.extra.serviceApi.upsertClient(client, client =>
    thunkAPI.dispatch(following({ ...client }))
  );
  thunkAPI.signal.addEventListener("abort", result.abort);
  result.promise.catch(errorMessage => thunkAPI.rejectWithValue(errorMessage));
  return new Promise<UpsertClientResult>((resolve, reject) => {
    result.promise
      .then(client => resolve({ client, success: true }))
      .catch(value => reject(value));
  });
});

const defaultLimit = 20;
export const loadClients = createAsyncThunk<
  // Return type of the payload creator
  ClientListingResponse,
  // First argument to the payload creator
  ClientListingArgsU,
  AppThunkAPI
>(
  "client/load_many",
  async (args, thunkAPI): Promise<ClientListingResponse> => {
    thunkAPI.dispatch(requested(args));
    // we need all clients to be there
    // order creation need to have them in the selection list
    const result = thunkAPI.extra.serviceApi.getClients(
      { ...args, limit: args?.limit || defaultLimit },
      clientListingResponse =>
        thunkAPI.dispatch(received({ clientListingResponse, args }))
    );
    thunkAPI.signal.addEventListener("abort", result.abort);
    result.promise.catch(errorMessage =>
      thunkAPI.rejectWithValue(errorMessage)
    );
    const clients = await result.promise;
    return clients;
  }
);

const getFilterId = (args: ClientListingArgsU): string => {
  return Md5.init(JSON.stringify(args) || "");
};

const slice = createSlice({
  name: "client",
  initialState,
  reducers: {
    requested: (state, action: PayloadAction<ClientListingArgsU>) => {
      const id = getFilterId(action.payload);

      state.filtered[id] = {
        args: action.payload,
        list: [],
        loaded: false,
        total: -1,
      };
      state.status = "began_fetching";
    },
    received: (
      state,
      {
        payload,
      }: PayloadAction<{
        clientListingResponse: ClientListingResponse;
        args: ClientListingArgsU;
      }>
    ) => {
      const id = getFilterId(payload.args);
      payload.clientListingResponse.clients.forEach(client => {
        state.list[client.id] = client;
      });
      state.filtered[id].list = payload.clientListingResponse.clients;
      state.filtered[id].loaded = true;
      state.filtered[id].total = payload.clientListingResponse.total;
      state.status = "loaded";
    },
    updated: (state, action: PayloadAction<Client>) => {
      const id = action.payload.id;
      state.list[action.payload.id] = {
        // keep ClientWithTotals-specific props (totalBilled and invoicesCount)
        ...state.list[action.payload.id],
        ...action.payload,
      };

      // Update the client in any contained cached page
      Object.keys(state.filtered).forEach(key => {
        state.filtered[key].list.forEach((client, idx) => {
          if (client.id === id) {
            state.filtered[key].list[idx] = {
              ...state.filtered[key].list[idx],
              ...action.payload,
            };
          }
        });
      });
    },
    added: (state, action: PayloadAction<Client>) => {
      const client = action.payload;
      state.list[action.payload.id] = {
        totalBilled: 0,
        invoicesCount: 0,
        ...client,
      };

      // invalidate and update pages
      Object.keys(state.filtered).forEach(key => {
        const page = state.filtered[key];
        const args = page.args || {};
        const sortBy = [
          args.sort?.clientName,
          args.sort?.companyName,
          args.sort?.totalBilled,
          args.sort?.invoicesCount,
        ];
        const hasOtherSorting = !sortBy.every(sort => sort === undefined);

        const isSinglePage =
          args.offset === undefined && page.total === page.list.length;
        const isLastPage =
          isSinglePage ||
          (args.offset !== undefined &&
            args.offset === page.total - page.list.length);
        const limit = args.limit || defaultLimit;
        const isPageFull =
          isLastPage && page.list.length + limit === page.total;

        let shouldInvalidate;

        page.total += 1;

        if (!hasOtherSorting) {
          const clientWithTotals = {
            ...client,
            totalBilled: 0,
            invoicesCount: 0,
          };

          // First page of "latest client", must preppend new client
          if (args.sort?.creation === "desc") {
            if (args.offset === 0) {
              const [first, ...rest] = state.filtered[key].list;
              state.filtered[key].list = [clientWithTotals, ...rest];
            } else {
              // every other page will have their elements shifted by one
              shouldInvalidate = true;
            }
          } else if (isLastPage && !isPageFull) {
            // non-full last-page in ascending creation order
            state.filtered[key].list.push(clientWithTotals);
          }
        } else {
          // Has other sort criteria. harder to determin.
          shouldInvalidate = true;
        }

        if (shouldInvalidate) {
          delete state.filtered[key];
        }
      });
    },
    removed: (state, action: PayloadAction<ClientWithTotals>) => {
      const { id } = action.payload;
      delete state.list[id];
    },
  },
  extraReducers: builder => {
    builder.addCase(userLoggedIn, () => {
      loadClientBegan = false;
    });
    builder.addCase(userLoggedOut, state => {
      return { ...initialState };
    });

    const updateClientTotals =
      (coef: 1 | -1) =>
      (
        state: WritableDraft<ClientsState>,
        action: PayloadAction<ClientInvoice>
      ) => {
        const id = action.payload.client.id;
        state.list[id].totalBilled += coef * action.payload.invoice.value;
        state.list[id].invoicesCount += coef * 1;

        // keep client cache pages updated after invoices are inserted
        Object.keys(state.filtered).forEach(key => {
          const page = state.filtered[key];
          page.list.forEach(client => {
            if (client.id === id) {
              client.totalBilled += coef * action.payload.invoice.value;
              client.invoicesCount += coef * 1;
            }
          });
        });
      };

    const incrementToClients = updateClientTotals(1);
    builder.addCase(invoiceAdded, incrementToClients);
    builder.addCase(invoiceUpdated, incrementToClients);
    builder.addCase(beforeUpdateInvoice, updateClientTotals(-1));

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

export const { added, updated, removed, received, requested } = slice.actions;

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

export const clientFilteredSelector = createSelector(
  clientSliceSelector,
  clientSlice => clientSlice.filtered
);

export const clientFilteredBySelectorCreator = (args: ClientListingArgsU) =>
  createSelector(
    clientFilteredSelector,
    filtered => filtered[getFilterId(args)] || undefined
  );

export const filteredListBeganSelectorCreator = (args: ClientListingArgsU) =>
  createSelector(
    clientFilteredBySelectorCreator(args),
    filtered => filtered !== undefined
  );

export const clientFilteredTotalSelectorCreator = (args: ClientListingArgsU) =>
  createSelector(
    clientFilteredBySelectorCreator(args),
    filtered => filtered?.total
  );

export const clientFilteredListSelectorCreator = (args: ClientListingArgsU) =>
  createSelector(
    clientFilteredBySelectorCreator(args),
    filtered => filtered?.list
  );

export const getMostValuableClientsSelector = createSelector(
  clientListSelector,
  clientList => clientList.filter(isMostValuableClient)
);

export const getClientsByCompanyNameSelector = (companyName: string) =>
  createSelector(clientListSelector, clientList =>
    clientList.filter(client => client.companyDetails.name === companyName)
  );

export const clientByIdSelector = (id: string | null) =>
  createSelector(
    clientListSelector,
    clientList => clientList.filter(client => client.id === id).pop() || null
  );

export const getClientOptionsSelector = createSelector(
  clientListSelector,
  clientList => clientListToOptions(clientList)
);

export const clientStatusSelector = createSelector(
  clientSliceSelector,
  clientSlice => clientSlice.status
);

// hooks
const useClientSelector = <TState, TSelected>(
  selector: (state: TState) => TSelected,
  args?: ClientListingArgsU
) => {
  const began = useSelector(filteredListBeganSelectorCreator(args));
  const dispatch = useDispatch();
  useEffect(() => {
    if (!began) {
      dispatch(loadClients(args));
    }
  }, [dispatch, args, began]);
  return useSelector<TState, TSelected>(selector);
};

const useClientSelectorCreator = <TState, TSelected>(
  selectorCreator: (args?: ClientListingArgsU) => (state: TState) => TSelected,
  args?: ClientListingArgsU
) => {
  const began = useSelector(filteredListBeganSelectorCreator(args));
  const dispatch = useDispatch();
  useEffect(() => {
    if (!began) {
      console.log({
        requesPage: (args?.offset || 0) / (args?.limit || defaultLimit) + 1,
      });
      dispatch(loadClients(args));
    }
  }, [dispatch, args, began]);

  // prevent the selector from being created each time
  // otherwise it wont memoize his results
  const selector = useMemo(
    () => selectorCreator(args),
    [args, selectorCreator]
  );
  const result = useSelector<TState, TSelected>(selector);
  return began ? result : null;
};

export const useClientOptions = () =>
  useClientSelector(getClientOptionsSelector);
export const useClientSlice = () => useSelector(clientSliceSelector);
export const useAllClients = () =>
  useClientSelectorCreator(clientFilteredBySelectorCreator, { limit: 9999999 });
export const useClientList = (args?: ClientListingArgsU) =>
  useClientSelectorCreator(clientFilteredBySelectorCreator, args);
export const useClientListTotal = (args?: ClientListingArgsU) =>
  useClientSelectorCreator(clientFilteredTotalSelectorCreator, args);
export const useFilteredClients = (args?: ClientListingArgsU) =>
  useClientSelectorCreator(clientFilteredBySelectorCreator, args);
export const useLoadClientError = () => useSelector(loadClientErrorSelector);
const useLoadClientState = () => useSelector(loadClientStateSelector);
export const useClientLoading = () => {
  const state = useLoadClientState();
  return state === "none" || state === "loading";
};
export const useClientStatus = () => useSelector(clientStatusSelector);
export const useClientById = (id: string | null) =>
  useClientSelector(clientByIdSelector(id), { limit: 9999999 });
export const useUpsertClient = () => {
  const dispatch = useThunkDispatch();
  return (client: Client) => dispatch(upsertClient(client));
};
export const useUpsertClientLastRequest = () =>
  useSelector(upsertClientLastRequestSelector);
export const useUpsertClientError = () =>
  useSelector(upsertClientErrorSelector);
export const useUpsertClientState = () =>
  useSelector(upsertClientStateSelector);
