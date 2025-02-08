import { clientsideApiClient } from "@ui/apiClient";
import { MaterialsSchemaType } from "./spendProfile.zod";
import { projectCostUpdater } from "./spendProfileCosts.logic";
import { IPCRsApi } from "@server/apis/pcrs";

export const useOnUpdateMaterials = () => {
  return projectCostUpdater<MaterialsSchemaType, IPCRsApi<"client">["addPartnerProjectCostMaterials"]>(
    clientsideApiClient.pcrs.addPartnerProjectCostMaterials,
  );
};
