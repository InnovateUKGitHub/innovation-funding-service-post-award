import { PCRStepType } from "@framework/constants/pcrConstants";
import { LoanDrawdownExtensionStep } from "@ui/containers/pages/pcrs/loanDrawdownExtension/loanDrawdownExtensionStep";
import { IPCRWorkflow } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { LoanDrawdownExtensionSummary } from "./loanDrawdownExtensionStepSummary";

export type LoanExtensionStepNames = PCRStepType.loanExtension;

export const loanExtensionItemWorkflow: IPCRWorkflow = {
  steps: [
    {
      stepName: PCRStepType.loanExtension,
      displayName: "Loan extension",
      stepNumber: 1,
      stepRender: LoanDrawdownExtensionStep,
    },
  ],
  summary: {
    summaryRender: LoanDrawdownExtensionSummary,
  },
};
