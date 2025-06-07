import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const mainApi = createApi({
    reducerPath: "mainApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://presentation-project-server.onrender.com",
        prepareHeaders: (headers) => {
            return headers;
        },
    }),
    endpoints: () => ({}),
});

export const { } = mainApi;
