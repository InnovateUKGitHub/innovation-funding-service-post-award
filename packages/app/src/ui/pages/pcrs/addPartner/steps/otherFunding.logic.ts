import { OtherFundingSchemaType } from "./schemas/otherFunding.zod";
import { pcrUpdater } from "../../pcrItemWorkflow.logic";

export const useOnUpdateAddPartnerOtherFunding = () => {
  return pcrUpdater<OtherFundingSchemaType>("addPartnerOtherFunding");
};
