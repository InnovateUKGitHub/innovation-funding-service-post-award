import { MaterialsSchemaType } from "./spendProfile.zod";
import { projectCostUpdater } from "./spendProfileCosts.logic";

export const useOnUpdateMaterials = () => {
  return projectCostUpdater<MaterialsSchemaType>("addPartnerProjectCostMaterials");
};
