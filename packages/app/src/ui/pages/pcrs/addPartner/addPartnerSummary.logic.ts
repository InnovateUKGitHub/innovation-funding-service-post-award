import { pcrUpdater } from "../pcrItemWorkflow.logic";
import { AddPartnerSchemaType } from "./addPartnerSummary.zod";

export const useOnUpdateAddPartnerSummary = () => {
  return pcrUpdater<AddPartnerSchemaType>("addPartnerSummary");
};
