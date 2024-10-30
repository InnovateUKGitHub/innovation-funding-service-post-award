import { PCRStepType } from "@framework/constants/pcrConstants";
import { IPCRWorkflow } from "../pcrWorkflow";
import { SuspendProjectStep } from "./suspendProjectStep";
import { SuspendProjectSummary } from "./suspendProjectSummary";

export type SuspendProjectSteps = PCRStepType.details;

export const suspendProjectWorkflow: IPCRWorkflow = {
  steps: [
    {
      stepName: PCRStepType.details,
      displayName: "Suspension details",
      stepNumber: 1,
      stepRender: SuspendProjectStep,
    },
  ],
  summary: {
    summaryRender: SuspendProjectSummary,
  },
};
