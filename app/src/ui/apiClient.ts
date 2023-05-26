/* eslint-disable @typescript-eslint/naming-convention */
import { IApiClient, serverApis } from "../server/apis";
// use server api file here. It gets overwritten for clientside by webpack
export const apiClient = serverApis as unknown as IApiClient;
