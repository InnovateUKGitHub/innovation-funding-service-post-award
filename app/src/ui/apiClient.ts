import { IApiClient, serverApis } from "@server/apis";

// Server APIs here
export const apiClient = serverApis as unknown as IApiClient<"server">;

// Client APIs here.
// It gets overwritten for clientside by webpack
export const clientsideApiClient = null as unknown as IApiClient<"client">;
