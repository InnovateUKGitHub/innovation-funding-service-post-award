import { PCRStepType } from "@framework/constants/pcrConstants";
import { IPCRWorkflow } from "../pcrWorkflow";
import { TimeExtensionStep } from "./timeExtensionStep";
import { TimeExtensionSummary } from "./timeExtensionSummary";

export type TimeExtensionStepNames = PCRStepType.timeExtension;

export const timeExtensionItemWorkflow: IPCRWorkflow = {
  steps: [
    {
      stepName: PCRStepType.timeExtension,
      displayName: "Time extension",
      stepNumber: 1,
      stepRender: TimeExtensionStep,
    },
  ],
  summary: {
    summaryRender: TimeExtensionSummary,
  },
};
