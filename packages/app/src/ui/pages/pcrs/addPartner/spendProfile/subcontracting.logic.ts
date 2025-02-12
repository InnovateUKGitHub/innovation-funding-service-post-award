import { SubcontractingSchemaType } from "./spendProfile.zod";
import { projectCostUpdater } from "./spendProfileCosts.logic";

export const useOnUpdateSubcontracting = () => {
  return projectCostUpdater<SubcontractingSchemaType>("addPartnerProjectCostSubcontracting");
};
