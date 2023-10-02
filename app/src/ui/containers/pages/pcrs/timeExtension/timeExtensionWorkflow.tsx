import { PCRStepType } from "@framework/constants/pcrConstants";
import { PCRItemForTimeExtensionDto } from "@framework/dtos/pcrDtos";
import { IPCRWorkflow } from "../pcrWorkflow";
import { TimeExtensionStep } from "./timeExtensionStep";
import { TimeExtensionSummary } from "./timeExtensionSummary";

export type TimeExtensionStepNames = PCRStepType.timeExtension;

export const timeExtensionItemWorkflow: IPCRWorkflow<PCRItemForTimeExtensionDto, null> = {
  steps: [
    {
      stepName: PCRStepType.timeExtension,
      displayName: "Time extension",
      stepNumber: 1,
      migratedStepRender: TimeExtensionStep,
    },
  ],
  migratedSummary: {
    migratedSummaryRender: TimeExtensionSummary,
  },
  isMigratedToGql: true,
};
