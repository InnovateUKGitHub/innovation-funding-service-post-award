import { PCRStepType } from "@framework/constants/pcrConstants";
import { PCRItemForAccountNameChangeDto } from "@framework/dtos/pcrDtos";
import { RenamePartnerStep } from "@ui/containers/pages/pcrs/renamePartner/renamePartnerStep";
import { PCRPrepareItemFilesStep } from "@ui/containers/pages/pcrs/renamePartner/prepareItemFilesStep";
import { RenamePartnerSummary } from "@ui/containers/pages/pcrs/renamePartner/renamePartnerSummary";
import { IPCRWorkflow } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { PCRAccountNameChangeItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";

export type accountNameChangeStepNames = PCRStepType.partnerNameStep | PCRStepType.filesStep;

export const accountNameChangeWorkflow: IPCRWorkflow<
  PCRItemForAccountNameChangeDto,
  PCRAccountNameChangeItemDtoValidator
> = {
  steps: [
    {
      stepName: PCRStepType.partnerNameStep,
      displayName: "Partner details",
      stepNumber: 1,
      validation: val => val.pcr,
      stepRender: RenamePartnerStep,
    },
    {
      stepName: PCRStepType.filesStep,
      displayName: "Upload change of name certificate",
      stepNumber: 2,
      validation: val => val,
      stepRender: PCRPrepareItemFilesStep,
    },
  ],
  summary: {
    validation: val => val,
    summaryRender: RenamePartnerSummary,
  },
};
