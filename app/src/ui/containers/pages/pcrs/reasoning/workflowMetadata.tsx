import { PCRPrepareReasoningStep } from "@ui/containers/pages/pcrs/reasoning/prepareReasoningStep";
import { PCRPrepareReasoningFilesStep } from "@ui/containers/pages/pcrs/reasoning/prepareFilesStep";
import { BaseProps } from "@ui/containers/containerBase";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { PCRStepType } from "@framework/constants/pcrConstants";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { MultipleDocumentUploadDtoValidator } from "@ui/validation/validators/documentUploadValidator";
import { PCRDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";

export interface ReasoningStepProps extends BaseProps {
  projectId: ProjectId;
  pcrId: PcrId;
  editor: IEditorStore<PCRDto, PCRDtoValidator>;
  documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>;
  onChange: (dto: PCRDto) => void;
  onSave: (dto: PCRDto) => void;
  documents: DocumentSummaryDto[];
  refresh: () => void;
}

export interface IReasoningWorkflowMetadata {
  stepName: PCRStepType.reasoningStep | PCRStepType.filesStep;
  stepNumber: 1 | 2;
  stepRender: (props: ReasoningStepProps) => React.ReactNode;
}

export const reasoningWorkflowSteps: IReasoningWorkflowMetadata[] = [
  {
    stepName: PCRStepType.reasoningStep,
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
    stepName: PCRStepType.filesStep,
    stepNumber: 2,
    stepRender: function PCRReasoningWorkflowFilesStep(props: ReasoningStepProps) {
      return <PCRPrepareReasoningFilesStep {...props} onSave={(dto: PCRDto) => props.onSave(dto)} />;
    },
  },
];
