import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { boatApi } from "../api";

const store = configureStore({
  reducer: {
    [boatApi.reducerPath]: boatApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(boatApi.middleware)
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
