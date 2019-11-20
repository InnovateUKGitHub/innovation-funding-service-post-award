import { PCRStandardItemDto } from "@framework/dtos";
import { PCRStandardItemDtoValidator } from "@ui/validators";
import { IWorkflow } from "../workflow";
import { FilesStep } from "./filesStep";
import { Summary } from "./summary";

type stepNames = "filesStep";

export const standardItemWorkflow: IWorkflow<PCRStandardItemDto, PCRStandardItemDtoValidator, stepNames> = {
  steps: [
    {
      stepName: "filesStep",
      displayName: "Upload files",
      stepNumber: 1,
      stepRender: FilesStep
    }
  ],
  summaryRender: Summary
};
