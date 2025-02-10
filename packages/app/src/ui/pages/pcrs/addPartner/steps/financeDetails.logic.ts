import { clientsideApiClient } from "@ui/apiClient";
import { FinanceDetailsSchemaType } from "./schemas/financialDetails.zod";
import { pcrUpdater } from "../../pcrItemWorkflow.logic";
import { IPCRsApi } from "@server/apis/pcrs";

export const useOnUpdateAddPartnerFinancialDetails = () => {
  return pcrUpdater<FinanceDetailsSchemaType, IPCRsApi<"client">["addPartnerFinancialDetails"]>(
    clientsideApiClient.pcrs.addPartnerFinancialDetails,
  );
};
