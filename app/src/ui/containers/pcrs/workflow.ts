import React from "react";
import { Results } from "@ui/validation";
import { PCRDto, PCRItemDto, ProjectDto } from "@framework/dtos";
import { EditorStatus, IEditorStore } from "@ui/redux";
import { MultipleDocumentUpdloadDtoValidator, PCRBaseItemDtoValidator } from "@ui/validators";
import { ILinkInfo } from "@framework/types";

export interface StepProps<T, TVal extends Results<T>> {
  project: ProjectDto;
  pcr: PCRDto;
  pcrItem: T;
  documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>;
  validator: TVal;
  status: EditorStatus;
  onChange: (dto: T) => void;
  onSave: () => void;
}

export interface ICallableStepProps {
  project: ProjectDto;
  pcr: PCRDto;
  pcrItem: PCRItemDto;
  documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>;
  validator: PCRBaseItemDtoValidator<PCRItemDto>;
  status: EditorStatus;
  onChange: (dto: PCRItemDto) => void;
  onSave: () => void;
}

export interface SummaryProps<T, TVal extends Results<T>> {
  projectId: string;
  pcr: PCRDto;
  pcrItem: T;
  validator: TVal;
  mode: "prepare" | "review" | "view";
  onSave: () => React.ReactNode;
  getStepLink: (stepName: IStep<T, TVal>["stepName"]) => ILinkInfo;
}

export interface ICallableSummaryProps {
  projectId: string;
  pcr: PCRDto;
  pcrItem: PCRItemDto;
  validator: PCRBaseItemDtoValidator<PCRItemDto>;
  mode: "prepare" | "review" | "view";
  onSave: () => void;
  getStepLink: (stepName: ICallableStep["stepName"]) => ILinkInfo;
}

export interface IStep<T, TVal extends Results<T>> {
  stepName: string;
  stepNumber: number;
  stepRender: (props: StepProps<T, TVal>) => React.ReactNode;
}

export interface ICallableStep {
  stepName: string;
  stepNumber: number;
  stepRender: (props: ICallableStepProps) => React.ReactNode;
}

interface IWorkflow<T, TVal extends Results<T>> {
  steps: IStep<T, TVal>[];
  summaryRender: (props: SummaryProps<T, TVal>) => React.ReactNode;
}

export interface ICallableWorkflow {
  summaryRender: (props: ICallableSummaryProps) => React.ReactNode;
  findStepByName: (stepName: ICallableStep["stepName"]) => ICallableStep;
  getStep: () => ICallableStep | null;
  nextStep: () => ICallableStep["stepNumber"] | undefined;
  isOnSummary: () => boolean;
  stepRender: (props: ICallableStepProps) => React.ReactNode;
}

export abstract class WorkFlow<T, TVal extends Results<T>> implements ICallableWorkflow {
  protected constructor(private definition: IWorkflow<T, TVal>, private stepNumber: ICallableStep["stepNumber"] | undefined) {}

  public summaryRender = (props: ICallableSummaryProps) => this.definition.summaryRender(props as any);

  public stepRender(props: ICallableStepProps) {
    if (!this.stepNumber) return null;
    return this.findStepByNumber(this.stepNumber).stepRender(props);
  }

  private findStepByNumber(stepNumber: ICallableStep["stepNumber"]): ICallableStep {
    const step = this.definition.steps.find(x => x.stepNumber === stepNumber);
    return step as any as ICallableStep;
  }

  public getStep(): ICallableStep|null {
    return this.stepNumber ? this.findStepByNumber(this.stepNumber) : null;
  }

  public findStepByName(stepName: ICallableStep["stepName"]): ICallableStep {
    const step = this.definition.steps.find(x => x.stepName === stepName);
    if (!step) {
      throw Error("No such step in workflow");
    }
    return step as any as ICallableStep;
  }

  public isOnSummary() {
    return !this.stepNumber;
  }

  private hasNextStep() {
    return !!this.stepNumber && this.stepNumber < this.definition.steps.length;
  }

  public nextStep() {
    return this.hasNextStep() ? this.stepNumber! + 1 : undefined;
  }
}
