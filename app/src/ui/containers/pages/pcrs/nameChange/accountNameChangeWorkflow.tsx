import { PCRStepId } from "@framework/constants/pcrConstants";
import { PCRItemForAccountNameChangeDto } from "@framework/dtos/pcrDtos";
import { NameChangeStep } from "@ui/containers/pages/pcrs/nameChange/nameChangeStep";
import { PCRPrepareItemFilesStep } from "@ui/containers/pages/pcrs/nameChange/prepareItemFilesStep";
import { NameChangeSummary } from "@ui/containers/pages/pcrs/nameChange/summary";
import { IPCRWorkflow } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { PCRAccountNameChangeItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";

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
