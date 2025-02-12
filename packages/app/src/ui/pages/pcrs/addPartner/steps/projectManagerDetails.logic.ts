import { ProjectManagerSchemaType } from "./schemas/projectManager.zod";
import { pcrUpdater } from "../../pcrItemWorkflow.logic";

export const useOnUpdateAddPartnerProjectManager = () => {
  return pcrUpdater<ProjectManagerSchemaType>("addPartnerProjectManager");
};
