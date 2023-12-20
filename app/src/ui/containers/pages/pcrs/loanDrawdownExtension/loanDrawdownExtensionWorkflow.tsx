import { PCRStepType } from "@framework/constants/pcrConstants";
import { PCRItemForLoanDrawdownExtensionDto } from "@framework/dtos/pcrDtos";
import { LoanDrawdownExtensionStep } from "@ui/containers/pages/pcrs/loanDrawdownExtension/loanDrawdownExtensionStep";
import { IPCRWorkflow } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { PCRLoanExtensionItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { LoanDrawdownExtensionSummary } from "./loanDrawdownExtensionStepSummary";

export type LoanExtensionStepNames = PCRStepType.loanExtension;

export const loanExtensionItemWorkflow: IPCRWorkflow<
  PCRItemForLoanDrawdownExtensionDto,
  PCRLoanExtensionItemDtoValidator
> = {
  steps: [
    {
      stepName: PCRStepType.loanExtension,
      displayName: "Loan extension",
      stepNumber: 1,
      migratedStepRender: LoanDrawdownExtensionStep,
    },
  ],
  migratedSummary: {
    migratedSummaryRender: LoanDrawdownExtensionSummary,
  },
  isMigratedToGql: true,
};
