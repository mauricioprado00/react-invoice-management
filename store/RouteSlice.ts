// this was an attempt of controling the url/content via a redux state
// which worked fine, one could navigate through the page and then replay the
// navigation and actions via the chrome redux extension
// the problem is that when user hits the go back button
// there wasn't a way to tell that the redux action had to change
// or that simply the url was wrong and it was bringing him back
// it is disabled in navigation.tsx
// and links in utility/Link are not used anymore

import { useRouter as useNextRouter } from "next/router";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "./RootSlice";
import { route } from "next/dist/server/router";

export type RouteState = {
  history: string[];
};
const initialState: RouteState = {
  history: [],
};

const slice = createSlice({
  name: "route",
  initialState,
  reducers: {
    newLocation: (route, action: PayloadAction<string>) => {
      route.history.push(action.payload);
    },
  },
  extraReducers: builder => {},
});

export const { newLocation } = slice.actions;

export default slice.reducer;

// business logic

// selectors
export const routeSliceSelector = (state: RootState): RouteState => state.route;

export const currentRouteSelector = createSelector(
  routeSliceSelector,
  routeSlice => {
    const [last] = routeSlice.history.slice().reverse();
    return last as string|undefined;
  }
);



// hooks

export const useRouter = () => {
  const dispatch = useDispatch();
  const router = useNextRouter();
  return useMemo(() => {
    return {
      push: (url: string) => dispatch(newLocation(url)),
      query: router.query,
    };
  }, [dispatch, router]);
};

export const useCurrentRoute = () => {
  return useSelector(currentRouteSelector);
}

let initialUrl:string|null = null;

export const useInitRouter = () => {
  const router = useNextRouter();
  const currentRoute = useCurrentRoute();
  useEffect(() => {
    if (initialUrl === null) {
      initialUrl = router.asPath;
    }
    const url = currentRoute || initialUrl;
    if (url !== router.asPath) {
      console.log({url, route: router.asPath});
      try {
      router.push(url);
      } catch(e) {}
    }
  }, [router, currentRoute])
}