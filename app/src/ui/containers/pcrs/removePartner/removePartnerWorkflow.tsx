import { PCRItemForPartnerWithdrawalDto } from "@framework/dtos";
import { PCRPartnerWithdrawalItemDtoValidator } from "@ui/validators";
import { IPCRWorkflow } from "@ui/containers/pcrs/pcrWorkflow";
import { RemovePartnerStep } from "@ui/containers/pcrs/removePartner/removePartnerStep";
import { PCRPrepareItemFilesForPartnerWithdrawalStep } from "@ui/containers/pcrs/removePartner/prepareItemFilesForPartnerWithdrawalStep";
import { RemovePartnerSummary } from "@ui/containers/pcrs/removePartner/removePartnerSummary";
import { PCRStepId } from "@framework/types";

export type removePartnerStepNames = PCRStepId.removalPeriodStep | PCRStepId.filesStep;

export const removePartnerWorkflow: IPCRWorkflow<PCRItemForPartnerWithdrawalDto, PCRPartnerWithdrawalItemDtoValidator> =
  {
    steps: [
      {
        stepName: PCRStepId.removalPeriodStep,
        displayName: "Partner withdrawal",
        stepNumber: 1,
        validation: val => val.pcr,
        stepRender: RemovePartnerStep,
      },
      {
        stepName: PCRStepId.filesStep,
        displayName: "Upload withdrawal of partner certificate",
        stepNumber: 2,
        validation: val => val.files,
        stepRender: PCRPrepareItemFilesForPartnerWithdrawalStep,
      },
    ],
    summary: {
      validation: val => val,
      summaryRender: RemovePartnerSummary,
    },
  };
