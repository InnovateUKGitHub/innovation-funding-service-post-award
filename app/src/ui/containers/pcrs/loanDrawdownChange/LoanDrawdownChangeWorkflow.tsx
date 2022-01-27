import { PCRItemForLoanDrawdownChangeDto } from "@framework/dtos";
import { PCRLoanDrawdownChangeItemDtoValidator } from "@ui/validators";
import { IPCRWorkflow } from "@ui/containers/pcrs/pcrWorkflow";
import { LoanDrawdownChangeStepContainer } from "./LoanDrawdownChangeStep";
import { LoanDrawdownChangeSummary } from "./LoanDrawdownChangeSummary";

export type LoanDrawdownChangeStepName = "loanDrawdownChange";

export const LoanDrawdownChangeWorkflow: IPCRWorkflow<
  PCRItemForLoanDrawdownChangeDto,
  PCRLoanDrawdownChangeItemDtoValidator
> = {
  steps: [
    {
      stepName: "loanDrawdownChange",
      displayName: "Change Loan Duration",
      stepNumber: 1,
      validation: val => val.pcr,
      stepRender: LoanDrawdownChangeStepContainer,
    },
  ],
  summary: {
    validation: val => val,
    summaryRender: LoanDrawdownChangeSummary,
  },
};
