import { FetchBaseQueryArgs } from "@reduxjs/toolkit/dist/query/fetchBaseQuery";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ENV_VARIABLES } from "../../config";

export const prepareHeaders: FetchBaseQueryArgs["prepareHeaders"] = (
  headers
) => {
  headers.set(ENV_VARIABLES.apiKey as string, ENV_VARIABLES.apiValue as string);
  return headers;
};

export const baseQuery = fetchBaseQuery({
  baseUrl: `${ENV_VARIABLES.apiUrl}`,
  prepareHeaders
});
