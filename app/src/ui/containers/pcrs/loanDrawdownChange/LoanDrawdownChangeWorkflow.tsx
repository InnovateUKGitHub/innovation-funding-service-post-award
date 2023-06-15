import { PCRItemForLoanDrawdownChangeDto } from "@framework/dtos";
import { PCRLoanDrawdownChangeItemDtoValidator } from "@ui/validators";
import { IPCRWorkflow } from "@ui/containers/pcrs/pcrWorkflow";
import { LoanDrawdownChangeStepContainer } from "./LoanDrawdownChangeStep";
import { LoanDrawdownChangeSummary } from "./LoanDrawdownChangeSummary";
import { PCRStepId } from "@framework/types";

export type LoanDrawdownChangeStepName = PCRStepId.loanDrawdownChange;

export const LoanDrawdownChangeWorkflow: IPCRWorkflow<
  PCRItemForLoanDrawdownChangeDto,
  PCRLoanDrawdownChangeItemDtoValidator
> = {
  steps: [
    {
      stepName: PCRStepId.loanDrawdownChange,
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
