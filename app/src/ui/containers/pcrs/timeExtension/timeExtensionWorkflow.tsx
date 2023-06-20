import { PCRStepId } from "@framework/constants/pcrConstants";
import { PCRItemForTimeExtensionDto } from "@framework/dtos/pcrDtos";
import { PCRTimeExtensionItemDtoValidator } from "@ui/validators/pcrDtoValidator";
import { IPCRWorkflow } from "../pcrWorkflow";
import { TimeExtensionStepContainer } from "./timeExtensionStep";
import { TimeExtensionSummary } from "./timeExtensionSummary";

export type TimeExtensionStepNames = PCRStepId.timeExtension;

export const timeExtensionItemWorkflow: IPCRWorkflow<PCRItemForTimeExtensionDto, PCRTimeExtensionItemDtoValidator> = {
  steps: [
    {
      stepName: PCRStepId.timeExtension,
      displayName: "Time extension",
      stepNumber: 1,
      validation: val => val.pcr,
      stepRender: TimeExtensionStepContainer,
    },
  ],
  summary: {
    validation: val => val,
    summaryRender: TimeExtensionSummary,
  },
};
