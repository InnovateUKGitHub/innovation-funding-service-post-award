import { AcademicCostsSchemaType } from "./schemas/academicCosts.zod";
import { pcrUpdater } from "../../pcrItemWorkflow.logic";

export const useOnUpdateAddPartnerAcademicCosts = () => {
  return pcrUpdater<AcademicCostsSchemaType>("addPartnerAcademicCosts");
};
