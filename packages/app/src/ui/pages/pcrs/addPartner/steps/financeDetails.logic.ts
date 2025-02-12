import { FinanceDetailsSchemaType } from "./schemas/financialDetails.zod";
import { pcrUpdater } from "../../pcrItemWorkflow.logic";

export const useOnUpdateAddPartnerFinancialDetails = () => {
  return pcrUpdater<FinanceDetailsSchemaType>("addPartnerFinancialDetails");
};
