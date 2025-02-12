import { OtherSourcesOfFundingSchemaType } from "./schemas/otherSourcesOfFunding.zod";
import { pcrUpdater } from "../../pcrItemWorkflow.logic";

export const useOnUpdateAddPartnerOtherSourcesOfFunding = () => {
  return pcrUpdater<OtherSourcesOfFundingSchemaType>("addPartnerOtherSourcesOfFunding");
};
