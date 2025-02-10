import { clientsideApiClient } from "@ui/apiClient";
import { AcademicCostsSchemaType } from "./schemas/academicCosts.zod";
import { IPCRsApi } from "@server/apis/pcrs";
import { pcrUpdater } from "../../pcrItemWorkflow.logic";

export const useOnUpdateAddPartnerAcademicCosts = () => {
  return pcrUpdater<AcademicCostsSchemaType, IPCRsApi<"client">["addPartnerAcademicCosts"]>(
    clientsideApiClient.pcrs.addPartnerAcademicCosts,
  );
};
