import { PCRPrepareReasoningStep } from "@ui/containers/pcrs/reasoning/prepareReasoningStep";
import { PCRDto } from "@framework/dtos";
import { PCRPrepareReasoningFilesStep } from "@ui/containers/pcrs/reasoning/prepareFilesStep";
import { IEditorStore } from "@ui/redux";
import { MultipleDocumentUploadDtoValidator, PCRDtoValidator } from "@ui/validators";
import { BaseProps } from "@ui/containers/containerBase";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";

export interface ReasoningStepProps extends BaseProps {
  projectId: ProjectId;
  pcrId: PcrId;
  editor: IEditorStore<PCRDto, PCRDtoValidator>;
  documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>;
  onChange: (dto: PCRDto) => void;
  onSave: (dto: PCRDto) => void;
}

export interface IReasoningWorkflowMetadata {
  stepName: "reasoningStep" | "filesStep";
  stepNumber: 1 | 2;
  stepRender: (props: ReasoningStepProps) => React.ReactNode;
}

export const reasoningWorkflowSteps: IReasoningWorkflowMetadata[] = [
  {
    stepName: "reasoningStep",
    stepNumber: 1,
    stepRender: function PCRReasoningWorkflowReasoningStep(props: ReasoningStepProps) {
      return (
        <PCRPrepareReasoningStep
          {...props}
          onSave={(dto: PCRDto) => props.onSave(dto)}
          onChange={dto => props.onChange(dto)}
        />
      );
    },
  },
  {
    stepName: "filesStep",
    stepNumber: 2,
    stepRender: function PCRReasoningWorkflowFilesStep(props: ReasoningStepProps) {
      return <PCRPrepareReasoningFilesStep {...props} onSave={(dto: PCRDto) => props.onSave(dto)} />;
    },
  },
];
