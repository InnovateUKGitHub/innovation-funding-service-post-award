import { AwardRateSchemaType } from "./schemas/awardRate.zod";
import { pcrUpdater } from "../../pcrItemWorkflow.logic";

export const useOnUpdateAddPartnerAwardRate = () => {
  return pcrUpdater<AwardRateSchemaType>("addPartnerFundingLevel");
};
