import { IWorkflow } from "../workflow";
import { PCRItemForProjectSuspensionDto } from "@framework/dtos";
import { PCRProjectSuspensionItemDtoValidator } from "@ui/validators";
import { SuspendProjectDetails } from "./suspendProjectDetails";
import { SuspendProjectSummary } from "./suspendProjectSummary";

export type suspendProjectSteps = "details";

export const suspendProjectWorkflow: IWorkflow<PCRItemForProjectSuspensionDto, PCRProjectSuspensionItemDtoValidator, suspendProjectSteps> = {
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
