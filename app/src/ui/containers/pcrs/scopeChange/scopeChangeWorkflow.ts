import { PCRItemForScopeChangeDto } from "@framework/dtos";
import { PublicDescriptionChangeStep } from "./publicDescriptionChangeStep";
import { ProjectSummaryChangeStep } from "./projectSummaryChangeStep";
import { PCRScopeChangeItemDtoValidator } from "@ui/validators";
import { ScopeChangeSummary } from "./scopeChangeSummary";
import { IWorkflow } from "@ui/containers/pcrs/workflow";

export type scopeChangeStepNames = "publicDescriptionStep" | "projectSummaryStep";

export const scopeChangeWorkflow: IWorkflow<PCRItemForScopeChangeDto, PCRScopeChangeItemDtoValidator, scopeChangeStepNames> = {
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
