import { PCRStepType } from "@framework/constants/pcrConstants";
import { PCRItemForAccountNameChangeDto } from "@framework/dtos/pcrDtos";
import { RenamePartnerStep } from "@ui/containers/pages/pcrs/renamePartner/renamePartnerStep";
import { RemovePartnerFilesStep } from "@ui/containers/pages/pcrs/renamePartner/removePartnerFilesStep";
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
      // validation: val => val.pcr,
      migratedStepRender: RenamePartnerStep,
    },
    {
      stepName: PCRStepType.filesStep,
      displayName: "Upload change of name certificate",
      stepNumber: 2,
      // validation: val => val,
      migratedStepRender: RemovePartnerFilesStep,
    },
  ],
  migratedSummary: {
    // validation: val => val,
    migratedSummaryRender: RenamePartnerSummary,
  },
  isMigratedToGql: true,
};
