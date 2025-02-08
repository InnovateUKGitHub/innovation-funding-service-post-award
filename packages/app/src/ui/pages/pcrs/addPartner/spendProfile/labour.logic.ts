import { clientsideApiClient } from "@ui/apiClient";
import { LabourSchemaType } from "./spendProfile.zod";
import { projectCostUpdater } from "./spendProfileCosts.logic";
import { IPCRsApi } from "@server/apis/pcrs";

export const useOnUpdateLabour = () => {
  return projectCostUpdater<LabourSchemaType, IPCRsApi<"client">["addPartnerProjectCostLabour"]>(
    clientsideApiClient.pcrs.addPartnerProjectCostLabour,
  );
};
