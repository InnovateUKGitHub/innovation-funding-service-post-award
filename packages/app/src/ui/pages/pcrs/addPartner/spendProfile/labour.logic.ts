import { LabourSchemaType } from "./spendProfile.zod";
import { projectCostUpdater } from "./spendProfileCosts.logic";

export const useOnUpdateLabour = () => {
  return projectCostUpdater<LabourSchemaType>("addPartnerProjectCostLabour");
};
