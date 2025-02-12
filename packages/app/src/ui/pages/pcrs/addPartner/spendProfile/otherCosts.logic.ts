import { OtherCostsSchemaType } from "./spendProfile.zod";
import { projectCostUpdater } from "./spendProfileCosts.logic";

export const useOnUpdateOtherCosts = () => {
  return projectCostUpdater<OtherCostsSchemaType>("addPartnerProjectCostOtherCost");
};
