import { clientsideApiClient } from "@ui/apiClient";
import { OtherSourcesOfFundingSchemaType } from "./schemas/otherSourcesOfFunding.zod";
import { pcrUpdater } from "../../pcrItemWorkflow.logic";
import { IPCRsApi } from "@server/apis/pcrs";

export const useOnUpdateAddPartnerOtherSourcesOfFunding = () => {
  return pcrUpdater<OtherSourcesOfFundingSchemaType, IPCRsApi<"client">["addPartnerOtherSourcesOfFunding"]>(
    clientsideApiClient.pcrs.addPartnerOtherSourcesOfFunding,
  );
};
