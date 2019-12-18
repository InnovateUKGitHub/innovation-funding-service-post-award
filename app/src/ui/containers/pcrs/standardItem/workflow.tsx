import { PCRStandardItemDto } from "@framework/dtos";
import { PCRStandardItemDtoValidator } from "@ui/validators";
import { FilesStep } from "./filesStep";
import { Summary } from "./summary";
import { IPCRWorkflow } from "@ui/containers/pcrs/pcrWorkflow";

export type standardItemStepNames = "filesStep";

export const standardItemWorkflow: IPCRWorkflow<PCRStandardItemDto, PCRStandardItemDtoValidator> = {
  steps: [
    {
      stepName: "filesStep",
      displayName: "Upload files",
      stepNumber: 1,
      stepRender: FilesStep
    }
  ],
  summary:
    {
      summaryRender: Summary
    }
};
