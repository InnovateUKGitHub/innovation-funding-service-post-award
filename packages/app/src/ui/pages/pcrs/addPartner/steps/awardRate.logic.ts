import { clientsideApiClient } from "@ui/apiClient";
import { AwardRateSchemaType } from "./schemas/awardRate.zod";
import { pcrUpdater } from "../../pcrItemWorkflow.logic";
import { IPCRsApi } from "@server/apis/pcrs";

export const useOnUpdateAddPartnerAwardRate = () => {
  return pcrUpdater<AwardRateSchemaType, IPCRsApi<"client">["addPartnerFundingLevel"]>(
    clientsideApiClient.pcrs.addPartnerFundingLevel,
  );
};
