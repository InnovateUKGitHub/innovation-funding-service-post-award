import { PCRStandardItemDto } from "@framework/dtos";
import { PCRStandardItemDtoValidator } from "@ui/validators";
import { FinancialVirementSummary } from "./financialVirementsSummary";
import { IPCRWorkflow } from "@ui/containers/pcrs/pcrWorkflow";

export const financialVirementWorkflow: IPCRWorkflow<PCRStandardItemDto, PCRStandardItemDtoValidator> = {
  steps: [],
  summary: {
    validation: val => val,
    summaryRender: FinancialVirementSummary
  }
};
