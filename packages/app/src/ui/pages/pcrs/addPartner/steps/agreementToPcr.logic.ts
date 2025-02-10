import { clientsideApiClient } from "@ui/apiClient";
import { AgreementToPcrSchema } from "./schemas/agreementToPcr.zod";
import { pcrUpdater } from "../../pcrItemWorkflow.logic";
import { IPCRsApi } from "@server/apis/pcrs";

export const useOnUpdateAddPartnerAgreementToPcr = () => {
  return pcrUpdater<AgreementToPcrSchema, IPCRsApi<"client">["addPartnerAgreementToPcr"]>(
    clientsideApiClient.pcrs.addPartnerAgreementToPcr,
  );
};
