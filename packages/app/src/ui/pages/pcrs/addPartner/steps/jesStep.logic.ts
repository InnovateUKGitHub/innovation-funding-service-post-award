import { JesStepSchema } from "./schemas/jesStep.zod";
import { pcrUpdater } from "../../pcrItemWorkflow.logic";

export const useOnUpdateAddPartnerJesStep = () => {
  return pcrUpdater<JesStepSchema>("addPartnerJesStep");
};
