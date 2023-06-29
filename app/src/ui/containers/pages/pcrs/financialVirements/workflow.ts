import { PCRItemForMultiplePartnerFinancialVirementDto } from "@framework/dtos/pcrDtos";
import { IPCRWorkflow } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { MultiplePartnerFinancialVirementDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
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
