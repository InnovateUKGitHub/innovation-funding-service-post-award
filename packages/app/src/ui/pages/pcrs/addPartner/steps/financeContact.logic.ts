import { clientsideApiClient } from "@ui/apiClient";
import { FinanceContactSchemaType } from "./schemas/financeContact.zod";
import { pcrUpdater } from "../../pcrItemWorkflow.logic";
import { IPCRsApi } from "@server/apis/pcrs";

export const useOnUpdateAddPartnerFinanceContact = () => {
  return pcrUpdater<FinanceContactSchemaType, IPCRsApi<"client">["addPartnerFinanceContact"]>(
    clientsideApiClient.pcrs.addPartnerFinanceContact,
  );
};
