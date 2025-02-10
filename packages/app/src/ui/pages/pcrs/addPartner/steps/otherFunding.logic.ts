import { clientsideApiClient } from "@ui/apiClient";
import { OtherFundingSchemaType } from "./schemas/otherFunding.zod";
import { pcrUpdater } from "../../pcrItemWorkflow.logic";
import { IPCRsApi } from "@server/apis/pcrs";

export const useOnUpdateAddPartnerOtherFunding = () => {
  return pcrUpdater<OtherFundingSchemaType, IPCRsApi<"client">["addPartnerOtherFunding"]>(
    clientsideApiClient.pcrs.addPartnerOtherFunding,
  );
};
