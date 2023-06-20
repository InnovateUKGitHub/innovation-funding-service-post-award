import { IPCRWorkflow } from "@ui/containers/pcrs/pcrWorkflow";
import { ScopeChangeSummary } from "./scopeChangeSummary";
import { ProjectSummaryChangeStep } from "./projectSummaryChangeStep";
import { PublicDescriptionChangeStep } from "./publicDescriptionChangeStep";
import { PCRStepId, PCRItemType } from "@framework/constants/pcrConstants";
import { PCRItemForScopeChangeDto } from "@framework/dtos/pcrDtos";
import { CombinedResultValidator } from "@ui/validation/results";
import { PCRScopeChangeItemDtoValidator } from "@ui/validators/pcrDtoValidator";

export type scopeChangeStepNames = PCRStepId.publicDescriptionStep | PCRStepId.projectSummaryStep;

export const scopeChangeWorkflow: IPCRWorkflow<PCRItemForScopeChangeDto, PCRScopeChangeItemDtoValidator> = {
  steps: [
    {
      stepName: PCRStepId.publicDescriptionStep,
      displayName: "Proposed public description",
      stepNumber: 1,
      validation: val => {
        const itemValidator = val.pcr.items.results.find(
          x => x.model.type === PCRItemType.ScopeChange,
        ) as PCRScopeChangeItemDtoValidator;
        return new CombinedResultValidator(itemValidator.publicDescription);
      },
      stepRender: PublicDescriptionChangeStep,
    },
    {
      stepName: PCRStepId.projectSummaryStep,
      displayName: "Proposed project summary",
      stepNumber: 2,
      validation: val => {
        const itemValidator = val.pcr.items.results.find(
          x => x.model.type === PCRItemType.ScopeChange,
        ) as PCRScopeChangeItemDtoValidator;
        return new CombinedResultValidator(itemValidator.projectSummary);
      },
      stepRender: ProjectSummaryChangeStep,
    },
  ],
  summary: {
    validation: val => val,
    summaryRender: ScopeChangeSummary,
  },
};
