/*import { createSimpleRestDataProvider } from "@refinedev/rest/simple-rest";
import { API_URL } from "./constants";
import { DataProvider } from "@refinedev/core";
export const { dataProvider, kyInstance } = createSimpleRestDataProvider({
  apiURL: API_URL,
});
 **/

import {
  DataProvider,
  BaseRecord,
  GetListParams,
  GetListResponse,
} from "@refinedev/core";
import { MOCK_ACPS } from "./constants";

export const dataProvider: DataProvider = {
  //get list fetches all record used by usetable and other components to display lists of data, it accepts a resource name and parameters for pagination, sorting, and filtering
  getList: async <TData extends BaseRecord = BaseRecord>({
    resource,
  }: GetListParams): Promise<GetListResponse<TData>> => {
    if (resource !== "acps") {
      return { data: [] as TData[], total: 0 };
    }
    return {
      data: MOCK_ACPS as unknown as TData[],
      total: MOCK_ACPS.length,
    };
  },
  getOne: async () => {
    throw new Error("This function not present");
  },
  create: async () => {
    throw new Error("This function not present");
  },
  update: async () => {
    throw new Error("This function not present");
  },
  deleteOne: async () => {
    throw new Error("This function not present");
  },

  getApiUrl: () => "",
};
