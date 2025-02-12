import { OrganisationDetailsSchemaType } from "./schemas/organisationDetails.zod";
import { pcrUpdater } from "../../pcrItemWorkflow.logic";

export const useOnUpdateAddPartnerOrganisationDetails = () => {
  return pcrUpdater<OrganisationDetailsSchemaType>("addPartnerOrganisationDetails");
};
