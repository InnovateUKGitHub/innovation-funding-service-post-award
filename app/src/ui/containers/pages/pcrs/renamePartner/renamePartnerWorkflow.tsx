import { PCRStepType } from "@framework/constants/pcrConstants";
import { RenamePartnerStep } from "@ui/containers/pages/pcrs/renamePartner/renamePartnerStep";
import { RenamePartnerFilesStep } from "@ui/containers/pages/pcrs/renamePartner/renamePartnerFilesStep";
import { RenamePartnerSummary } from "@ui/containers/pages/pcrs/renamePartner/renamePartnerSummary";
import { IPCRWorkflow } from "@ui/containers/pages/pcrs/pcrWorkflow";

export type accountNameChangeStepNames = PCRStepType.partnerNameStep | PCRStepType.filesStep;

export const accountNameChangeWorkflow: IPCRWorkflow = {
  steps: [
    {
      stepName: PCRStepType.partnerNameStep,
      displayName: "Partner details",
      stepNumber: 1,
      stepRender: RenamePartnerStep,
    },
    {
      stepName: PCRStepType.filesStep,
      displayName: "Upload change of name certificate",
      stepNumber: 2,
      stepRender: RenamePartnerFilesStep,
    },
  ],
  summary: {
    summaryRender: RenamePartnerSummary,
  },
};
