import { clientsideApiClient } from "@ui/apiClient";
import { OrganisationDetailsSchemaType } from "./schemas/organisationDetails.zod";
import { pcrUpdater } from "../../pcrItemWorkflow.logic";
import { IPCRsApi } from "@server/apis/pcrs";

export const useOnUpdateAddPartnerOrganisationDetails = () => {
  return pcrUpdater<OrganisationDetailsSchemaType, IPCRsApi<"client">["addPartnerOrganisationDetails"]>(
    clientsideApiClient.pcrs.addPartnerOrganisationDetails,
  );
};
