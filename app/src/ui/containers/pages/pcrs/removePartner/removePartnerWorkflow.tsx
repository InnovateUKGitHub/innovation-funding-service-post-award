import { IPCRWorkflow } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { RemovePartnerStep } from "@ui/containers/pages/pcrs/removePartner/removePartnerStep";
import { RemovePartnerSummary } from "@ui/containers/pages/pcrs/removePartner/removePartnerSummary";
import { PCRStepType } from "@framework/constants/pcrConstants";
import { PCRItemForPartnerWithdrawalDto } from "@framework/dtos/pcrDtos";
import { PCRPartnerWithdrawalItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { RemovePartnerFilesStep } from "./removePartnerFilesStep";

export type removePartnerStepNames = PCRStepType.removalPeriodStep | PCRStepType.filesStep;

export const removePartnerWorkflow: IPCRWorkflow<PCRItemForPartnerWithdrawalDto, PCRPartnerWithdrawalItemDtoValidator> =
  {
    steps: [
      {
        stepName: PCRStepType.removalPeriodStep,
        displayName: "Partner withdrawal",
        stepNumber: 1,
        migratedStepRender: RemovePartnerStep,
      },
      {
        stepName: PCRStepType.filesStep,
        displayName: "Upload withdrawal of partner certificate",
        stepNumber: 2,
        migratedStepRender: RemovePartnerFilesStep,
      },
    ],
    migratedSummary: {
      migratedSummaryRender: RemovePartnerSummary,
    },
    isMigratedToGql: true,
  };
