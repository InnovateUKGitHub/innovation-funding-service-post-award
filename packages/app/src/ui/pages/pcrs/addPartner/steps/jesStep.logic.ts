import { clientsideApiClient } from "@ui/apiClient";
import { JesStepSchema } from "./schemas/jesStep.zod";
import { pcrUpdater } from "../../pcrItemWorkflow.logic";
import { IPCRsApi } from "@server/apis/pcrs";

export const useOnUpdateAddPartnerJesStep = () => {
  return pcrUpdater<JesStepSchema, IPCRsApi<"client">["addPartnerJesStep"]>(clientsideApiClient.pcrs.addPartnerJesStep);
};
