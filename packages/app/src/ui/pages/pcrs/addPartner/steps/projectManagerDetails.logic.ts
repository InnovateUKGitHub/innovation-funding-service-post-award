import { clientsideApiClient } from "@ui/apiClient";
import { ProjectManagerSchemaType } from "./schemas/projectManager.zod";
import { pcrUpdater } from "../../pcrItemWorkflow.logic";
import { IPCRsApi } from "@server/apis/pcrs";

export const useOnUpdateAddPartnerProjectManager = () => {
  return pcrUpdater<ProjectManagerSchemaType, IPCRsApi<"client">["addPartnerProjectManager"]>(
    clientsideApiClient.pcrs.addPartnerProjectManager,
  );
};
