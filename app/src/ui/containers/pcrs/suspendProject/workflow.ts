import { PCRItemForProjectSuspensionDto } from "@framework/dtos";
import { PCRProjectSuspensionItemDtoValidator } from "@ui/validators";
import { IPCRWorkflow } from "@ui/containers/pcrs/pcrWorkflow";
import { SuspendProjectDetails } from "./suspendProjectDetails";
import { SuspendProjectSummary } from "./suspendProjectSummary";
import { PCRStepId } from "@framework/types";

export type SuspendProjectSteps = PCRStepId.details;

export const suspendProjectWorkflow: IPCRWorkflow<
  PCRItemForProjectSuspensionDto,
  PCRProjectSuspensionItemDtoValidator
> = {
  steps: [
    {
      stepName: PCRStepId.details,
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
