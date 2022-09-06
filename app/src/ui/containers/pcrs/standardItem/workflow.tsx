import { PCRStandardItemDto } from "@framework/dtos";
import { PCRStandardItemDtoValidator } from "@ui/validators";
import { IPCRWorkflow } from "@ui/containers/pcrs/pcrWorkflow";
import { FilesStep } from "./filesStep";
import { Summary } from "./summary";

export type StandardItemStepNames = "filesStep";

export const standardItemWorkflow: IPCRWorkflow<PCRStandardItemDto, PCRStandardItemDtoValidator> = {
  steps: [
    {
      stepName: "filesStep",
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
