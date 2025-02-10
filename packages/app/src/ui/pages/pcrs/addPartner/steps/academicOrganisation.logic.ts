import { clientsideApiClient } from "@ui/apiClient";
import { AcademicOrganisationSchemaType } from "./schemas/academicOrganisation.zod";
import { pcrUpdater } from "../../pcrItemWorkflow.logic";
import { IPCRsApi } from "@server/apis/pcrs";

export const useOnUpdateAddPartnerAcademicOrganisation = () => {
  return pcrUpdater<AcademicOrganisationSchemaType, IPCRsApi<"client">["addPartnerAcademicOrganisation"]>(
    clientsideApiClient.pcrs.addPartnerAcademicOrganisation,
  );
};
