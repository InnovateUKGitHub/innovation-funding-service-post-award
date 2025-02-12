import { AcademicOrganisationSchemaType } from "./schemas/academicOrganisation.zod";
import { pcrUpdater } from "../../pcrItemWorkflow.logic";

export const useOnUpdateAddPartnerAcademicOrganisation = () => {
  return pcrUpdater<AcademicOrganisationSchemaType>("addPartnerAcademicOrganisation");
};
