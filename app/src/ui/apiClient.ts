/* eslint-disable @typescript-eslint/naming-convention */
import { serverApis } from "../server/apis";
// use server api file here. It gets overwritten for clientside by webpack
export const apiClient = serverApis;
