import { AgreementToPcrSchema } from "./schemas/agreementToPcr.zod";
import { pcrUpdater } from "../../pcrItemWorkflow.logic";

export const useOnUpdateAddPartnerAgreementToPcr = () => {
  return pcrUpdater<AgreementToPcrSchema>("addPartnerAgreementToPcr");
};
