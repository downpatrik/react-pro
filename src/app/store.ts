import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "features/authRouting";
import { baseApi } from "shared/api";

export function createAppStore() {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware, authApi.middleware),
  });
}

export const store = createAppStore();
