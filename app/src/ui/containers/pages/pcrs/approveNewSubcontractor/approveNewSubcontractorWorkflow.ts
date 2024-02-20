import { PCRStepType } from "@framework/constants/pcrConstants";
import { IPCRWorkflow } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { ApproveNewSubcontractorSummary } from "./ApproveNewSubcontractorSummary";
import { ApproveNewSubcontractorStep } from "./ApproveNewSubcontractorStep";

const approveNewSubcontractorWorkflow: IPCRWorkflow = {
  steps: [
    {
      stepName: PCRStepType.approveNewContractorNameStep,
      displayName: "Approve a New Subcontractor",
      stepNumber: 1,
      stepRender: ApproveNewSubcontractorStep,
    },
  ],
  summary: {
    summaryRender: ApproveNewSubcontractorSummary,
  },
};

export { approveNewSubcontractorWorkflow };
