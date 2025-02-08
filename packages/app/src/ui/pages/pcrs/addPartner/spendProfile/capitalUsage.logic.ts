import { clientsideApiClient } from "@ui/apiClient";
import { CapitalUsageSchemaType } from "./spendProfile.zod";
import { projectCostUpdater } from "./spendProfileCosts.logic";
import { IPCRsApi } from "@server/apis/pcrs";

export const useOnUpdateCapitalUsage = () => {
  return projectCostUpdater<CapitalUsageSchemaType, IPCRsApi<"client">["addPartnerProjectCostCapitalUsage"]>(
    clientsideApiClient.pcrs.addPartnerProjectCostCapitalUsage,
  );
};
