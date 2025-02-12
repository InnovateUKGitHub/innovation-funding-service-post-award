import { CapitalUsageSchemaType } from "./spendProfile.zod";
import { projectCostUpdater } from "./spendProfileCosts.logic";

export const useOnUpdateCapitalUsage = () => {
  return projectCostUpdater<CapitalUsageSchemaType>("addPartnerProjectCostCapitalUsage");
};
