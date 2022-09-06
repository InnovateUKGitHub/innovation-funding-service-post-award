import { PCRItemForTimeExtensionDto } from "@framework/dtos";
import { TimeExtensionSummary } from "@ui/containers/pcrs/timeExtension/timeExtensionSummary";
import { TimeExtensionStepContainer } from "@ui/containers/pcrs/timeExtension/timeExtensionStep";
import { PCRTimeExtensionItemDtoValidator } from "@ui/validators";
import { IPCRWorkflow } from "@ui/containers/pcrs/pcrWorkflow";

export type TimeExtensionStepNames = "timeExtension";

export const timeExtensionItemWorkflow: IPCRWorkflow<PCRItemForTimeExtensionDto, PCRTimeExtensionItemDtoValidator> = {
  steps: [
    {
      stepName: "timeExtension",
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
