import { configureStore } from "@reduxjs/toolkit";
import { mainApi } from "./api/";
import presentation from "./features/presentation.slice"

export const store = configureStore({
  reducer: {
    presentation,
    [mainApi.reducerPath]: mainApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(mainApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
