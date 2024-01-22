import { PCRStepType } from "@framework/constants/pcrConstants";
import { PCRItemForApproveNewSubcontractorDto } from "@framework/dtos/pcrDtos";
import { IPCRWorkflow } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { PCRApproveNewSubcontractorItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { ApproveNewSubcontractorSummary } from "./ApproveNewSubcontractorSummary";
import { ApproveNewSubcontractorStep } from "./ApproveNewSubcontractorStep";

const approveNewSubcontractorWorkflow: IPCRWorkflow<
  PCRItemForApproveNewSubcontractorDto,
  PCRApproveNewSubcontractorItemDtoValidator
> = {
  steps: [
    {
      stepName: PCRStepType.approveNewContractorNameStep,
      displayName: "Approve a New Subcontractor",
      stepNumber: 1,
      migratedStepRender: ApproveNewSubcontractorStep,
    },
  ],
  migratedSummary: {
    migratedSummaryRender: ApproveNewSubcontractorSummary,
  },
  isMigratedToGql: true,
};

export { approveNewSubcontractorWorkflow };
