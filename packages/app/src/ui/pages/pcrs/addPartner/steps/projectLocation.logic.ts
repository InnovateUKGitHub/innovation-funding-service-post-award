import { clientsideApiClient } from "@ui/apiClient";
import { ProjectLocationSchemaType } from "./schemas/projectLocation.zod";
import { pcrUpdater } from "../../pcrItemWorkflow.logic";
import { IPCRsApi } from "@server/apis/pcrs";

export const useOnUpdateAddPartnerProjectLocation = () => {
  return pcrUpdater<ProjectLocationSchemaType, IPCRsApi<"client">["addPartnerProjectLocation"]>(
    clientsideApiClient.pcrs.addPartnerProjectLocation,
  );
};
