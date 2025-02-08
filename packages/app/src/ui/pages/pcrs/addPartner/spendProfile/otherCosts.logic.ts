import { clientsideApiClient } from "@ui/apiClient";
import { OtherCostsSchemaType } from "./spendProfile.zod";
import { projectCostUpdater } from "./spendProfileCosts.logic";
import { IPCRsApi } from "@server/apis/pcrs";

export const useOnUpdateOtherCosts = () => {
  return projectCostUpdater<OtherCostsSchemaType, IPCRsApi<"client">["addPartnerProjectCostOtherCost"]>(
    clientsideApiClient.pcrs.addPartnerProjectCostOtherCost,
  );
};
