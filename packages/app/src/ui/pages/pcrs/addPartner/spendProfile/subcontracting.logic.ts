import { clientsideApiClient } from "@ui/apiClient";
import { SubcontractingSchemaType } from "./spendProfile.zod";
import { projectCostUpdater } from "./spendProfileCosts.logic";
import { IPCRsApi } from "@server/apis/pcrs";

export const useOnUpdateSubcontracting = () => {
  return projectCostUpdater<SubcontractingSchemaType, IPCRsApi<"client">["addPartnerProjectCostSubcontracting"]>(
    clientsideApiClient.pcrs.addPartnerProjectCostSubcontracting,
  );
};
