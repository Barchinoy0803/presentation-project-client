import { mainApi } from './index'

const extendedApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    getPresentations: build.query({
      query: () => ({
        method: "GET",
        url:  '/presentation',
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useGetPresentationsQuery } = extendedApi