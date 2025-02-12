import { ProjectLocationSchemaType } from "./schemas/projectLocation.zod";
import { pcrUpdater } from "../../pcrItemWorkflow.logic";

export const useOnUpdateAddPartnerProjectLocation = () => {
  return pcrUpdater<ProjectLocationSchemaType>("addPartnerProjectLocation");
};
