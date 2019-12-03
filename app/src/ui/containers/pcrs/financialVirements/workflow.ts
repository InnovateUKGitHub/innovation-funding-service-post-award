import { IWorkflow } from "../workflow";
import { PCRStandardItemDto } from "@framework/dtos";
import { PCRStandardItemDtoValidator } from "@ui/validators";
import { FinancialVirementSummary } from "./financialVirementsSummary";

export const financialVirementWorkflow: IWorkflow<PCRStandardItemDto, PCRStandardItemDtoValidator, ""> = {
  steps: [],
  summary: {
    summaryRender: FinancialVirementSummary
  }
};
