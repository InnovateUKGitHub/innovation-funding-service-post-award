import { IPCRWorkflow } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { ScopeChangeSummary } from "./scopeChangeSummary";
import { ProjectSummaryChangeStep } from "./projectSummaryChangeStep";
import { PublicDescriptionChangeStep } from "./publicDescriptionChangeStep";
import { PCRStepType } from "@framework/constants/pcrConstants";

export type scopeChangeStepNames = PCRStepType.publicDescriptionStep | PCRStepType.projectSummaryStep;

export const scopeChangeWorkflow: IPCRWorkflow = {
  steps: [
    {
      stepName: PCRStepType.publicDescriptionStep,
      displayName: "Proposed public description",
      stepNumber: 1,
      stepRender: PublicDescriptionChangeStep,
    },
    {
      stepName: PCRStepType.projectSummaryStep,
      displayName: "Proposed project summary",
      stepNumber: 2,
      stepRender: ProjectSummaryChangeStep,
    },
  ],
  summary: {
    summaryRender: ScopeChangeSummary,
  },
};
