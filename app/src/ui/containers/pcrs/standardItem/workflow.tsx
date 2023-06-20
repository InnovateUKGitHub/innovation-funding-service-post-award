import { PCRStepId } from "@framework/constants/pcrConstants";
import { PCRStandardItemDto } from "@framework/dtos/pcrDtos";
import { IPCRWorkflow } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRStandardItemDtoValidator } from "@ui/validators/pcrDtoValidator";
import { FilesStep } from "./filesStep";
import { Summary } from "./summary";

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
