import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ClientInvoice, ClientInvoiceList, Invoice } from "models/Invoice";
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
import { ClientInvoiceListResponse, InvoiceListingArgsU } from "api/apiclient";
import { Md5 } from "md5-typescript";

type InvoiceStatus = "initial" | "began_fetching" | "loaded";
let loadInvoiceBegan = false;

export type FilteredInvoicesList = {
  args: InvoiceListingArgsU;
  list: ClientInvoiceList;
  loaded: boolean;
  total: number;
};
export type ClientInvoicesState = {
  list: MapType<ClientInvoice>;
  filtered: MapType<FilteredInvoicesList>;
  requests: MapType<MapType<RequestInformation>>;
  status: InvoiceStatus;
};

const initialState: ClientInvoicesState = {
  list: {},
  filtered: {},
  // group all of these into a new attribute
  requests: {},
  status: "initial",
};

export type UpsertInvoiceResult = {
  clientInvoice: ClientInvoice;
  success?: boolean;
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

export const upsertInvoice = createAsyncThunk<
  // Return type of the payload creator
  UpsertInvoiceResult,
  // First argument to the payload creator
  ClientInvoice,
  AppThunkAPI
>(
  "invoice/add",
  async (clientInvoice, thunkAPI): Promise<UpsertInvoiceResult> => {
    const result = thunkAPI.extra.serviceApi.upsertInvoice(
      clientInvoice,
      clientInvoice => {
        if (clientInvoice.invoice.id) {
          const prevInvoice = invoiceByIdSelectorCreator(
            clientInvoice.invoice.id
          )(thunkAPI.getState());
          // thunkAPI.dispatch(removed())
          if (prevInvoice) {
            thunkAPI.dispatch(beforeUpdate(prevInvoice));
          }
          thunkAPI.dispatch(updated(clientInvoice));
        } else {
          thunkAPI.dispatch(added(clientInvoice));
        }
      }
    );
    thunkAPI.signal.addEventListener("abort", result.abort);
    result.promise.catch(errorMessage =>
      thunkAPI.rejectWithValue(errorMessage)
    );
    return {
      clientInvoice: await result.promise,
      success: true,
    };
  }
);

export const loadClientInvoices = createAsyncThunk<
  // Return type of the payload creator
  ClientInvoiceListResponse,
  // First argument to the payload creator
  InvoiceListingArgsU,
  AppThunkAPI
>(
  "invoice/load_many",
  async (args, thunkAPI): Promise<ClientInvoiceListResponse> => {
    thunkAPI.dispatch(requested(args));
    const result = thunkAPI.extra.serviceApi.getInvoices(
      args,
      clientInvoiceListResponse =>
        thunkAPI.dispatch(received({ clientInvoiceListResponse, args }))
    );
    thunkAPI.signal.addEventListener("abort", result.abort);
    const clientInvoices = await result.promise;
    return clientInvoices;
  }
);

export const loadClientInvoice = createAsyncThunk<
  // Return type of the payload creator
  ClientInvoice,
  // First argument to the payload creator
  string,
  AppThunkAPI
>("invoice/load_one", async (args, thunkAPI): Promise<ClientInvoice> => {
  const invoice = await thunkAPI.extra.serviceApi.getInvoice(args).promise;
  const client = await thunkAPI.extra.serviceApi.getClient(invoice.client_id)
    .promise;
  const clientInvoice = { invoice, client };
  thunkAPI.dispatch(receivedOne(clientInvoice));
  return clientInvoice;
});

const getFilterId = (args: InvoiceListingArgsU): string => {
  return Md5.init(JSON.stringify(args) || "");
};

const slice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    requested: (state, action: PayloadAction<InvoiceListingArgsU>) => {
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
        clientInvoiceListResponse: ClientInvoiceListResponse;
        args: InvoiceListingArgsU;
      }>
    ) => {
      const id = getFilterId(payload.args);
      payload.clientInvoiceListResponse.invoices.forEach(clientInvoice => {
        state.list[clientInvoice.invoice.id] = clientInvoice;
      });
      state.filtered[id].list = payload.clientInvoiceListResponse.invoices;
      state.filtered[id].loaded = true;
      state.filtered[id].total = payload.clientInvoiceListResponse.total;
      state.status = "loaded";
    },
    receivedOne: (
      state,
      { payload: clientInvoice }: PayloadAction<ClientInvoice>
    ) => {
      state.list[clientInvoice.invoice.id] = clientInvoice;
    },
    beforeUpdate: (state, action: PayloadAction<ClientInvoice>) => {
      // Dummy action to allow other slices listen to this event.
    },
    updated: (state, action: PayloadAction<ClientInvoice>) => {
      const id = action.payload.invoice.id;
      console.log({ updating: action });
      state.list[action.payload.invoice.id] = {
        ...action.payload,
      };

      Object.keys(state.filtered).forEach(key => {
        state.filtered[key].list.forEach((invoice, idx) => {
          if (invoice.invoice.id === id) {
            state.filtered[key].list[idx] = {
              ...action.payload,
            };
          }
        });
      });
    },
    added: (state, action: PayloadAction<ClientInvoice>) => {
      state.list[action.payload.invoice.id] = { ...action.payload };
    },
    removed: (state, action: PayloadAction<ClientInvoice>) => {
      const { id } = action.payload.invoice;
      delete state.list[id];
    },
  },
  extraReducers: builder => {
    builder.addCase(userLoggedIn, () => {
      loadInvoiceBegan = false;
    });
    builder.addCase(userLoggedOut, state => {
      return { ...initialState };
    });

    {
      const { pending, fulfilled, rejected } = requestReducers(
        "loadClientInvoices",
        5
      );
      builder.addCase(loadClientInvoices.pending, pending);
      builder.addCase(loadClientInvoices.fulfilled, fulfilled);
      builder.addCase(loadClientInvoices.rejected, rejected);
    }
    {
      const { pending, fulfilled, rejected } = requestReducers(
        "upsertInvoice",
        5
      );
      builder.addCase(upsertInvoice.pending, pending);
      builder.addCase(upsertInvoice.fulfilled, fulfilled);
      builder.addCase(upsertInvoice.rejected, rejected);
    }
    {
      const { pending, fulfilled, rejected } = requestReducers("loadOne", 5);
      builder.addCase(loadClientInvoice.pending, pending);
      builder.addCase(loadClientInvoice.fulfilled, fulfilled);
      builder.addCase(loadClientInvoice.rejected, rejected);
    }
  },
});

export const {
  added,
  beforeUpdate,
  updated,
  removed,
  received,
  receivedOne,
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

export const {
  lastSelector: upsertInvoiceLastRequestSelector,
  errorSelector: upsertInvoiceErrorSelector,
  stateSelector: upsertInvoiceStateSelector,
} = createRequestSelectors("upsertInvoice", clientInvoiceSliceSelector);

export const {
  lastSelector: loadOneLastRequestSelector,
  errorSelector: loadOneErrorSelector,
  stateSelector: loadOneStateSelector,
} = createRequestSelectors("loadOne", clientInvoiceSliceSelector);

const clientInvoiceListSelector = createSelector(
  clientInvoiceSliceSelector,
  clientInvoiceSlice => Object.values(clientInvoiceSlice.list)
);

export const clientInvoiceFilteredSelector = createSelector(
  clientInvoiceSliceSelector,
  cleintInvoiceSlice => cleintInvoiceSlice.filtered
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

export const clientInvoiceFilteredBySelectorCreator = (
  args: InvoiceListingArgsU
) =>
  createSelector(
    clientInvoiceFilteredSelector,
    filtered => filtered[getFilterId(args)] || undefined
  );

export const filteredListBeganSelectorCreator = (args: InvoiceListingArgsU) =>
  createSelector(
    clientInvoiceFilteredBySelectorCreator(args),
    filtered => filtered !== undefined
  );

export const clientInvoiceFilteredTotalSelectorCreator = (
  args: InvoiceListingArgsU
) =>
  createSelector(
    clientInvoiceFilteredBySelectorCreator(args),
    filtered => filtered?.total
  );

export const clientInvoiceFilteredListSelectorCreator = (
  args: InvoiceListingArgsU
) =>
  createSelector(
    clientInvoiceFilteredBySelectorCreator(args),
    filtered => filtered?.list
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

export const invoiceByIdSelectorCreator = (id: string | null) =>
  createSelector(
    clientInvoiceListSelector,
    clientInvoiceList =>
      clientInvoiceList
        .filter(clientInvoice => clientInvoice.invoice.id === id)
        .pop() || null
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
const useInvoiceSelector = <TState, TSelected>(
  selector: (state: TState) => TSelected,
  args?: InvoiceListingArgsU
) => {
  const began = useSelector(filteredListBeganSelectorCreator(args));
  const dispatch = useDispatch();
  useEffect(() => {
    if (!began) {
      dispatch(loadClientInvoices(args));
    }
  }, [dispatch, args, began]);
  return useSelector<TState, TSelected>(selector);
};

const useInvoiceSelectorCreator = <TState, TSelected>(
  selectorCreator: (args?: InvoiceListingArgsU) => (state: TState) => TSelected,
  args?: InvoiceListingArgsU
) => {
  const began = useSelector(filteredListBeganSelectorCreator(args));
  const dispatch = useDispatch();
  useEffect(() => {
    if (!began) {
      dispatch(loadClientInvoices(args));
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

export const useClientInvoiceOptions = () =>
  useSelector(getClientInvoiceOptionsSelector);
export const useInvoiceSlice = () => useSelector(clientInvoiceSliceSelector);
export const useInvoiceList = (args?: InvoiceListingArgsU) =>
  useInvoiceSelectorCreator(clientInvoiceFilteredBySelectorCreator, args);
export const useInvoiceListTotal = (args?: InvoiceListingArgsU) =>
  useInvoiceSelectorCreator(clientInvoiceFilteredTotalSelectorCreator, args);
export const useFilteredInvoices = (args?: InvoiceListingArgsU) =>
  useInvoiceSelectorCreator(clientInvoiceFilteredBySelectorCreator, args);
export const useLoadInvoiceError = () =>
  useSelector(loadClientInvoiceErrorSelector);
const useLoadInvoicesState = () => useSelector(loadClientInvoiceStateSelector);
export const useInvoicesLoading = () => {
  const state = useLoadInvoicesState();
  return state === "none" || state === "loading";
};
const useLoadInvoiceState = () => useSelector(loadOneStateSelector);
export const useInvoiceLoading = () => {
  const state = useLoadInvoiceState();
  return state === "none" || state === "loading";
};
export const useInvoiceStatus = () => useSelector(clientInvoiceStatusSelector);
export const useInvoiceById = (id: string) => {
  const selector = useMemo(() => invoiceByIdSelectorCreator(id), [id]);
  const invoice = useSelector(selector);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!invoice) {
      dispatch(loadClientInvoice(id));
    }
  }, [dispatch, id, invoice]);
  return invoice;
};

export const useInvoiceCount = () => {
  const unfiltered = useFilteredInvoices();
  return unfiltered?.total;
};
export const useInvoiceSum = () => useInvoiceSelector(clientInvoiceSumSelector);
export const useUpsertInvoice = () => {
  const dispatch = useThunkDispatch();
  return (clientInvoice: ClientInvoice) =>
    dispatch(upsertInvoice(clientInvoice));
};
export const useUpsertInvoiceLastRequest = () =>
  useInvoiceSelector(upsertInvoiceLastRequestSelector);
export const useUpsertInvoiceError = () =>
  useInvoiceSelector(upsertInvoiceErrorSelector);
export const useUpsertInvoiceState = () =>
  useInvoiceSelector(upsertInvoiceStateSelector);

export const useLoadOneLastRequest = () =>
  useSelector(loadOneLastRequestSelector);
export const useLoadOneError = () => useSelector(loadOneErrorSelector);
export const useLoadOneState = () => useSelector(loadOneStateSelector);
