import { PCRItemForAccountNameChangeDto } from "@framework/dtos";
import { NameChangeStep } from "@ui/containers/pcrs/nameChange/nameChangeStep";
import { PCRAccountNameChangeItemDtoValidator } from "@ui/validators";
import { PCRPrepareItemFilesStep } from "@ui/containers/pcrs/nameChange/prepareItemFilesStep";
import { NameChangeSummary } from "@ui/containers/pcrs/nameChange/summary";
import { IPCRWorkflow } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRStepId } from "@framework/types";

export type accountNameChangeStepNames = PCRStepId.partnerNameStep | PCRStepId.filesStep;

export const accountNameChangeWorkflow: IPCRWorkflow<
  PCRItemForAccountNameChangeDto,
  PCRAccountNameChangeItemDtoValidator
> = {
  steps: [
    {
      stepName: PCRStepId.partnerNameStep,
      displayName: "Partner details",
      stepNumber: 1,
      validation: val => val.pcr,
      stepRender: NameChangeStep,
    },
    {
      stepName: PCRStepId.filesStep,
      displayName: "Upload change of name certificate",
      stepNumber: 2,
      validation: val => val,
      stepRender: PCRPrepareItemFilesStep,
    },
  ],
  summary: {
    validation: val => val,
    summaryRender: NameChangeSummary,
  },
};
