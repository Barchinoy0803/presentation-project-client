import { mainApi } from './index'

const extendedApi = mainApi.injectEndpoints({
  endpoints: (build) => ({
    getPresentations: build.query({
      query: () => ({
        method: "GET",
        url:  '/presentation',
      }),
    }),
    createPresentation: build.mutation({
      query:(body) => ({
        method: 'POST',
        url: '/presentation/create',
        body,
      })
    })
  }),
  overrideExisting: false,
})

export const { useGetPresentationsQuery, useCreatePresentationMutation } = extendedApi