import { FinanceContactSchemaType } from "./schemas/financeContact.zod";
import { pcrUpdater } from "../../pcrItemWorkflow.logic";

export const useOnUpdateAddPartnerFinanceContact = () => {
  return pcrUpdater<FinanceContactSchemaType>("addPartnerFinanceContact");
};
