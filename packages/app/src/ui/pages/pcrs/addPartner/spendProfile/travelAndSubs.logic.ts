import { clientsideApiClient } from "@ui/apiClient";
import { TravelAndSubsistenceSchemaType } from "./spendProfile.zod";
import { projectCostUpdater } from "./spendProfileCosts.logic";
import { IPCRsApi } from "@server/apis/pcrs";

export const useOnUpdateTravelAndSubsistence = () => {
  return projectCostUpdater<
    TravelAndSubsistenceSchemaType,
    IPCRsApi<"client">["addPartnerProjectCostTravelAndSubsistence"]
  >(clientsideApiClient.pcrs.addPartnerProjectCostTravelAndSubsistence);
};
