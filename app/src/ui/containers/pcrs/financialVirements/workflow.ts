import { PCRItemForMultiplePartnerFinancialVirementDto } from "@framework/dtos/pcrDtos";
import { IPCRWorkflow } from "@ui/containers/pcrs/pcrWorkflow";
import { MultiplePartnerFinancialVirementDtoValidator } from "@ui/validators/pcrDtoValidator";
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
