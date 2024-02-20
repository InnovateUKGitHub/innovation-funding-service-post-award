import { IPCRWorkflow } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { RemovePartnerStep } from "@ui/containers/pages/pcrs/removePartner/removePartnerStep";
import { RemovePartnerSummary } from "@ui/containers/pages/pcrs/removePartner/removePartnerSummary";
import { PCRStepType } from "@framework/constants/pcrConstants";
import { RemovePartnerFilesStep } from "./removePartnerFilesStep";

export type removePartnerStepNames = PCRStepType.removalPeriodStep | PCRStepType.filesStep;

export const removePartnerWorkflow: IPCRWorkflow = {
  steps: [
    {
      stepName: PCRStepType.removalPeriodStep,
      displayName: "Partner withdrawal",
      stepNumber: 1,
      stepRender: RemovePartnerStep,
    },
    {
      stepName: PCRStepType.filesStep,
      displayName: "Upload withdrawal of partner certificate",
      stepNumber: 2,
      stepRender: RemovePartnerFilesStep,
    },
  ],
  summary: {
    summaryRender: RemovePartnerSummary,
  },
};
