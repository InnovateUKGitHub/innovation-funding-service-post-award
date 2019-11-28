import React from "react";
import { PCRPrepareReasoningStep } from "@ui/containers/pcrs/reasoning/prepareReasoningStep";
import { PCRDto } from "@framework/dtos";
import { PCRPrepareReasoningFilesStep } from "@ui/containers/pcrs/reasoning/prepareFilesStep";
import { IEditorStore } from "@ui/redux";
import { MultipleDocumentUpdloadDtoValidator, PCRDtoValidator } from "@ui/validators";
import { BaseProps } from "@ui/containers/containerBase";

export interface ReasoningStepProps extends BaseProps {
  projectId: string;
  pcrId: string;
  editor: IEditorStore<PCRDto, PCRDtoValidator>;
  documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>;
  onChange: (dto: PCRDto) => void;
  onSave: (dto: PCRDto) => void;
}

export interface IReasoningWorkflowMetadata {
  stepName: "reasoningStep" | "filesStep";
  stepNumber: 1 | 2;
  stepRender: (props: ReasoningStepProps) => React.ReactNode;
}

export const reasoningWorkflowSteps: IReasoningWorkflowMetadata[] = [{
  stepName: "reasoningStep",
  stepNumber: 1,
  stepRender: (props: ReasoningStepProps) => <PCRPrepareReasoningStep {...props} onSave={(dto: PCRDto) => props.onSave(dto)} onChange={(dto) => props.onChange(dto)} />
}, {
  stepName: "filesStep",
  stepNumber: 2,
  stepRender: (props: ReasoningStepProps) => <PCRPrepareReasoningFilesStep {...props} onSave={(dto: PCRDto) => props.onSave(dto)} />
}];
