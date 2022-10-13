import { createApi, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { ENV_VARIABLES } from "../config";
import { baseQuery } from "../store/utils";
import {
  ColorType,
  GetColorsRequest,
  GetColorsResponse,
  GetLayersRequest,
  GetScriptsResponse,
  RenderImageRequest
} from "./@types";

export const boatApi = createApi({
  reducerPath: "boatApi",
  baseQuery,
  tagTypes: ["Boat"],
  endpoints: (builder) => ({
    getAllColors: builder.query<any, GetColorsRequest>({
      async queryFn(
        { colorGroup, colorDescription = "", continuationToken = 0 },
        _queryApi,
        _extraOptions,
        fetchWithBQ
      ) {
        // get a random user
        const response = await fetchWithBQ(
          `/GetColors?colorGroup=${colorGroup}&colorDescription=${colorDescription}&continuationToken=${continuationToken}`
        );
        if (response.error)
          return { error: response.error as FetchBaseQueryError };
        const colors = response.data as ColorType[];
        const allPromises = colors.map(
          async (color) => await fetch(color.CoDImageURL)
        );
        const result = await Promise.all(allPromises);
        console.log({ result });
        return (response.data as ColorType)
          ? { data: response.data as ColorType }
          : { error: {} as FetchBaseQueryError };
      }
    }),
    getScripts: builder.query<GetScriptsResponse, void>({
      query: () => ({
        url: `/GetScripts?${ENV_VARIABLES.apiKey}=${ENV_VARIABLES.apiValue}`
        // url: `/GetScripts?${ENV_VARIABLES.apiKey}=${ENV_VARIABLES.apiValue}&withImage=true`
      }),
      // transformResponse: (response) => {
      //   // E15 CR-8
        
      //   return {
      //     data: null
      //   };
      // }
    }),
    getLayers: builder.query<void, GetLayersRequest>({
      query: ({ recipeName }) => ({
        url: `/GetLayers?recipeName=${recipeName}`
      })
    }),
    GetColors: builder.query<GetColorsResponse, GetColorsRequest>({
      query: ({ colorGroup, colorDescription, continuationToken = 0 }) => ({
        url: `/GetColors?colorGroup=${colorGroup}&colorDescription=${colorDescription}&continuationToken=${continuationToken}`
      })
    }),
    renderImage: builder.query<string, RenderImageRequest>({
      query: ({ Recipe, Layers, Codes, colorGroup }) => {
        const Instruments = new Array(Layers.split(",").length)
          .fill("800000001")
          .join(",");
        return {
          url: `/RenderImage?Recipe=${Recipe}&Layers=${Layers}&Codes=${Codes}&Instruments=${Instruments}&colorGroup=${colorGroup}&size=large`,
          responseHandler: async (response) => {
            const imageBlob = await response.blob();
            return URL.createObjectURL(imageBlob);
          }
        };
      }
    })
  })
});

export const {
  useGetLayersQuery,
  useGetScriptsQuery,
  useLazyGetColorsQuery,
  useGetColorsQuery,
  useLazyRenderImageQuery,
  useGetAllColorsQuery
} = boatApi;
