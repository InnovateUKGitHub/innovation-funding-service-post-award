import { PCRItemForScopeChangeDto } from "@framework/dtos";
import { PublicDescriptionChangeStep } from "./publicDescriptionChangeStep";
import { ProjectSummaryChangeStep } from "./projectSummaryChangeStep";
import { PCRScopeChangeItemDtoValidator } from "@ui/validators";
import { ScopeChangeSummary } from "./scopeChangeSummary";
import { IPCRWorkflow } from "@ui/containers/pcrs/pcrWorkflow";

export type scopeChangeStepNames = "publicDescriptionStep" | "projectSummaryStep";

export const scopeChangeWorkflow: IPCRWorkflow<PCRItemForScopeChangeDto, PCRScopeChangeItemDtoValidator> = {
  steps: [
    {
      stepName: "publicDescriptionStep",
      displayName: "Proposed public description",
      stepNumber: 1,
      stepRender: PublicDescriptionChangeStep
    },
    {
      stepName: "projectSummaryStep",
      displayName: "Proposed project summary",
      stepNumber: 2,
      stepRender: ProjectSummaryChangeStep
    }
  ],
  summary: {
    summaryRender: ScopeChangeSummary
  }
};
