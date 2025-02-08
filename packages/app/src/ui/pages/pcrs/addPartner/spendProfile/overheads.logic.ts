import { OverheadSchemaType } from "./spendProfile.zod";
import { clientsideApiClient } from "@ui/apiClient";
import { projectCostUpdater } from "./spendProfileCosts.logic";
import { IPCRsApi } from "@server/apis/pcrs";

export const useOnUpdateOverheads = () => {
  return projectCostUpdater<OverheadSchemaType, IPCRsApi<"client">["addPartnerProjectCostOverhead"]>(
    clientsideApiClient.pcrs.addPartnerProjectCostOverhead,
  );
};
