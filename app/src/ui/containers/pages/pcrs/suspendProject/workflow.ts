import { PCRStepType } from "@framework/constants/pcrConstants";
import { PCRItemForProjectSuspensionDto } from "@framework/dtos/pcrDtos";
import { PCRProjectSuspensionItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { IPCRWorkflow } from "../pcrWorkflow";
import { SuspendProjectDetails } from "./suspendProjectDetails";
import { SuspendProjectSummary } from "./suspendProjectSummary";

export type SuspendProjectSteps = PCRStepType.details;

export const suspendProjectWorkflow: IPCRWorkflow<
  PCRItemForProjectSuspensionDto,
  PCRProjectSuspensionItemDtoValidator
> = {
  steps: [
    {
      stepName: PCRStepType.details,
      displayName: "Suspension details",
      stepNumber: 1,
      validation: val => val.pcr,
      stepRender: SuspendProjectDetails,
    },
  ],
  summary: {
    validation: val => val,
    summaryRender: SuspendProjectSummary,
  },
};
