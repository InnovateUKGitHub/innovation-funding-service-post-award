import { IPCRWorkflow } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { ScopeChangeSummary } from "./scopeChangeSummary";
import { ProjectSummaryChangeStep } from "./projectSummaryChangeStep";
import { PublicDescriptionChangeStep } from "./publicDescriptionChangeStep";
import { PCRStepType } from "@framework/constants/pcrConstants";
import { PCRItemForScopeChangeDto } from "@framework/dtos/pcrDtos";

export type scopeChangeStepNames = PCRStepType.publicDescriptionStep | PCRStepType.projectSummaryStep;

export const scopeChangeWorkflow: IPCRWorkflow<PCRItemForScopeChangeDto, null> = {
  steps: [
    {
      stepName: PCRStepType.publicDescriptionStep,
      displayName: "Proposed public description",
      stepNumber: 1,
      migratedStepRender: PublicDescriptionChangeStep,
    },
    {
      stepName: PCRStepType.projectSummaryStep,
      displayName: "Proposed project summary",
      stepNumber: 2,
      migratedStepRender: ProjectSummaryChangeStep,
    },
  ],
  migratedSummary: {
    migratedSummaryRender: ScopeChangeSummary,
  },
  isMigratedToGql: true,
};
