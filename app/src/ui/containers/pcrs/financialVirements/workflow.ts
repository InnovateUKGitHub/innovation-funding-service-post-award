import { PCRItemForMultiplePartnerFinancialVirementDto } from "@framework/dtos";
import { MultiplePartnerFinancialVirementDtoValidator } from "@ui/validators";
import { FinancialVirementSummary } from "./financialVirementsSummary";
import { IPCRWorkflow } from "@ui/containers/pcrs/pcrWorkflow";

export const financialVirementWorkflow: IPCRWorkflow<PCRItemForMultiplePartnerFinancialVirementDto, MultiplePartnerFinancialVirementDtoValidator> = {
  steps: [],
  summary: {
    validation: val => val,
    summaryRender: FinancialVirementSummary
  }
};
