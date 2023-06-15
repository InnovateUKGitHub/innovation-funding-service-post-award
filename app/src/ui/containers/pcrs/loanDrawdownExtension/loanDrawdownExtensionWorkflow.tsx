import { PCRItemForLoanDrawdownExtensionDto } from "@framework/dtos";
import { PCRLoanExtensionItemDtoValidator } from "@ui/validators";

import { LoanDrawdownExtensionStepContainer } from "@ui/containers/pcrs/loanDrawdownExtension/loanDrawdownExtensionStep";

import { IPCRWorkflow } from "@ui/containers/pcrs/pcrWorkflow";
import { loanDrawdownExtensionStepSummary } from "./loanDrawdownExtensionStepSummary";
import { PCRStepId } from "@framework/types";

export type LoanExtensionStepNames = PCRStepId.loanExtension;

export const loanExtensionItemWorkflow: IPCRWorkflow<
  PCRItemForLoanDrawdownExtensionDto,
  PCRLoanExtensionItemDtoValidator
> = {
  steps: [
    {
      stepName: PCRStepId.loanExtension,
      displayName: "Loan extension",
      stepNumber: 1,
      validation: val => val.pcr,
      stepRender: LoanDrawdownExtensionStepContainer,
    },
  ],
  summary: {
    validation: val => val,
    summaryRender: loanDrawdownExtensionStepSummary,
  },
};
