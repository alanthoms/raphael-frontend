import { CreateDataProviderOptions, createDataProvider } from "@refinedev/rest";
import { BACKEND_BASE_URL } from "../constants";
import { CreateResponse, GetOneResponse, ListResponse } from "@/types";
import { HttpError } from "@refinedev/core";

if (!BACKEND_BASE_URL) {
  throw new Error("BACKEND_BASE_URL is not defined in environment variables");
}

const buildHttpError = async (response: Response): Promise<HttpError> => {
  let message = "Request failed";

  try {
    const payload = (await response.json()) as { message?: string };
    if (payload.message) message = payload.message;
  } catch {
    // Ignore JSON parsing errors and use the default message
  }
  return {
    message,
    statusCode: response.status,
  };
};

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource }) => `${resource}`,

    buildQueryParams: async ({ resource, pagination, filters }) => {
      const page = pagination?.currentPage ?? 1;
      const pageSize = pagination?.pageSize ?? 10;

      const params: Record<string, string | number> = { page, limit: pageSize };

      filters?.forEach((filter) => {
        const field = "field" in filter ? filter.field : "";
        const value = String(filter.value);

        if (resource === "acps") {
          if (field === "squadron") params.squadron = value;
          if (field === "name" || field === "serialNumber" || field === "type")
            params.search = value;
        }

        if (resource === "missions") {
          if (field === "search" || field === "name") params.search = value;
          if (field === "commander") params.commander = value;
        }
      });
      return params;
    },

    mapResponse: async (response) => {
      if (!response.ok) {
        throw await buildHttpError(response);
      }
      // Clone the response to avoid consuming it before the total count is extracted
      const payload: ListResponse = await response.clone().json();
      return payload.data ?? [];
    },
    getTotalCount: async (response) => {
      if (!response.ok) {
        throw await buildHttpError(response);
      }
      const payload: ListResponse = await response.clone().json();
      return payload.pagination?.total ?? payload.data?.length ?? 0;
    },
  },

  create: {
    getEndpoint: ({ resource }) => resource,
    buildBodyParams: async ({ variables }) => variables,

    mapResponse: async (response) => {
      const json: CreateResponse = await response.json();

      return json.data ?? [];
    },
  },

  //get details of any one resource
  getOne: {
    getEndpoint: ({ resource, id }) => `${resource}/${id}`,

    mapResponse: async (response) => {
      const json: GetOneResponse = await response.json();

      return json.data ?? [];
    },
  },
};

const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);

export { dataProvider };
