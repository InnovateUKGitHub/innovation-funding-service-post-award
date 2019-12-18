import { PCRItemForProjectSuspensionDto } from "@framework/dtos";
import { PCRProjectSuspensionItemDtoValidator } from "@ui/validators";
import { SuspendProjectDetails } from "./suspendProjectDetails";
import { SuspendProjectSummary } from "./suspendProjectSummary";
import { IPCRWorkflow } from "@ui/containers/pcrs/pcrWorkflow";

export type suspendProjectSteps = "details";

export const suspendProjectWorkflow: IPCRWorkflow<PCRItemForProjectSuspensionDto, PCRProjectSuspensionItemDtoValidator> = {
  steps:[
    {
      stepName: "details",
      displayName: "Suspention details",
      stepNumber: 1,
      stepRender: SuspendProjectDetails
    }
  ],
  summary:{
    summaryRender: SuspendProjectSummary
  }
};
