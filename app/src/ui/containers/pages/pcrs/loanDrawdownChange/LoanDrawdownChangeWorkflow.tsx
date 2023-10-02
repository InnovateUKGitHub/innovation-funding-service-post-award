import { PCRStepType } from "@framework/constants/pcrConstants";
import { PCRItemForLoanDrawdownChangeDto } from "@framework/dtos/pcrDtos";
import { IPCRWorkflow } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { PCRLoanDrawdownChangeItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { LoanDrawdownChangeStepContainer } from "./LoanDrawdownChangeStep";
import { LoanDrawdownChangeSummary } from "./LoanDrawdownChangeSummary";

export type LoanDrawdownChangeStepName = PCRStepType.loanDrawdownChange;

export const LoanDrawdownChangeWorkflow: IPCRWorkflow<
  PCRItemForLoanDrawdownChangeDto,
  PCRLoanDrawdownChangeItemDtoValidator
> = {
  steps: [
    {
      stepName: PCRStepType.loanDrawdownChange,
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
