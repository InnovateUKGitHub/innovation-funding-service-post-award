import { PCRStepType } from "@framework/constants/pcrConstants";
import { IPCRWorkflow } from "@ui/pages/pcrs/pcrWorkflow";
import { LoanDrawdownChangeStep } from "./LoanDrawdownChangeStep";
import { LoanDrawdownChangeSummary } from "./LoanDrawdownChangeSummary";

export type LoanDrawdownChangeStepName = PCRStepType.loanDrawdownChange;

export const LoanDrawdownChangeWorkflow: IPCRWorkflow = {
  steps: [
    {
      stepName: PCRStepType.loanDrawdownChange,
      displayName: "Change Loan Duration",
      stepNumber: 1,
      stepRender: LoanDrawdownChangeStep,
    },
  ],
  summary: {
    summaryRender: LoanDrawdownChangeSummary,
  },
};
