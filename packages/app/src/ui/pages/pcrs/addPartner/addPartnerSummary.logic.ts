import { IPCRsApi } from "@server/apis/pcrs";
import { pcrUpdater } from "../pcrItemWorkflow.logic";
import { AddPartnerSchemaType } from "./addPartnerSummary.zod";
import { clientsideApiClient } from "@ui/apiClient";

export const useOnUpdateAddPartnerSummary = () => {
  return pcrUpdater<AddPartnerSchemaType, IPCRsApi<"client">["addPartnerSummary"]>(
    clientsideApiClient.pcrs.addPartnerSummary,
  );
};
