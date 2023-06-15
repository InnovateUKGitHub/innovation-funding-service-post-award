import { PCRStandardItemDto } from "@framework/dtos";
import { PCRStandardItemDtoValidator } from "@ui/validators";
import { IPCRWorkflow } from "@ui/containers/pcrs/pcrWorkflow";
import { FilesStep } from "./filesStep";
import { Summary } from "./summary";
import { PCRStepId } from "@framework/types";

export type StandardItemStepNames = PCRStepId.filesStep;

export const standardItemWorkflow: IPCRWorkflow<PCRStandardItemDto, PCRStandardItemDtoValidator> = {
  steps: [
    {
      stepName: PCRStepId.filesStep,
      displayName: "Upload files",
      stepNumber: 1,
      validation: val => val.files,
      stepRender: FilesStep,
    },
  ],
  summary: {
    validation: val => val,
    summaryRender: Summary,
  },
};
