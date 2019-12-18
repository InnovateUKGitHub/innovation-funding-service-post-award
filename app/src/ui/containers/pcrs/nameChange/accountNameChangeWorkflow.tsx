import { PCRItemForAccountNameChangeDto } from "@framework/dtos";
import { NameChangeStep } from "@ui/containers/pcrs/nameChange/nameChangeStep";
import { PCRAccountNameChangeItemDtoValidator } from "@ui/validators";
import { PCRPrepareItemFilesStep } from "@ui/containers/pcrs/nameChange/prepareItemFilesStep";
import { NameChangeSummary } from "@ui/containers/pcrs/nameChange/summary";
import { IPCRWorkflow } from "@ui/containers/pcrs/pcrWorkflow";

export type accountNameChangeStepNames = "partnerNameStep" | "filesStep";

export const accountNameChangeWorkflow: IPCRWorkflow<PCRItemForAccountNameChangeDto, PCRAccountNameChangeItemDtoValidator> = {
  steps: [
    {
      stepName: "partnerNameStep",
      displayName: "Partner details",
      stepNumber: 1,
      stepRender: NameChangeStep
    },
    {
      stepName: "filesStep",
      displayName: "Upload change of name certificate",
      stepNumber: 2,
      stepRender: PCRPrepareItemFilesStep
    }
  ],
  summary: {
    summaryRender: NameChangeSummary
  }
};
