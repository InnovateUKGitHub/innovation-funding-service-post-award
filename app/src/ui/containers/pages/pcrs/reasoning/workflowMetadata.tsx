import { PCRPrepareReasoningStep } from "@ui/containers/pages/pcrs/reasoning/prepareReasoningStep";
import { PCRPrepareReasoningFilesStep } from "@ui/containers/pages/pcrs/reasoning/prepareFilesStep";
import { PCRStepType } from "@framework/constants/pcrConstants";

export interface IReasoningWorkflowMetadata {
  stepName: PCRStepType.reasoningStep | PCRStepType.filesStep;
  stepNumber: 1 | 2;
  stepRender: () => React.ReactNode;
}

export const reasoningWorkflowSteps: IReasoningWorkflowMetadata[] = [
  {
    stepName: PCRStepType.reasoningStep,
    stepNumber: 1,
    stepRender: function PCRReasoningWorkflowReasoningStep() {
      return <PCRPrepareReasoningStep />;
    },
  },
  {
    stepName: PCRStepType.filesStep,
    stepNumber: 2,
    stepRender: function PCRReasoningWorkflowFilesStep() {
      return <PCRPrepareReasoningFilesStep />;
    },
  },
];

export const getNextStepNumber = (stepNumber?: number) => {
  if (!stepNumber) return 1;
  const indexOfStep = reasoningWorkflowSteps.findIndex(x => x.stepNumber === stepNumber);
  if (indexOfStep + 1 >= reasoningWorkflowSteps.length) {
    return undefined;
  } else return reasoningWorkflowSteps[indexOfStep + 1]?.stepNumber;
};
