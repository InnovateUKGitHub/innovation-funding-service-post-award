import { PCRItemForMultiplePartnerFinancialVirementDto } from "@framework/dtos";
import { MultiplePartnerFinancialVirementDtoValidator } from "@ui/validators";
import { IPCRWorkflow } from "@ui/containers/pcrs/pcrWorkflow";
import { FinancialVirementSummary } from "./financialVirementsSummary";

export const financialVirementWorkflow: IPCRWorkflow<
  PCRItemForMultiplePartnerFinancialVirementDto,
  MultiplePartnerFinancialVirementDtoValidator
> = {
  steps: [],
  summary: {
    validation: val => val,
    summaryRender: FinancialVirementSummary,
  },
};
