import { createApi } from "@reduxjs/toolkit/query/react";
import { ENV_VARIABLES } from "../config";
import { baseQuery } from "../store/utils";
import {
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
    getScripts: builder.query<GetScriptsResponse, void>({
      query: () => ({
        url: `/GetScripts?${ENV_VARIABLES.apiKey}=${ENV_VARIABLES.apiValue}`
      }),
      providesTags: ["Boat"]
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
      },
      providesTags: ["Boat"]
    })
  })
});

export const {
  useGetLayersQuery,
  useGetScriptsQuery,
  useLazyGetColorsQuery,
  useGetColorsQuery,
  useLazyRenderImageQuery
} = boatApi;
