import React from "react";
import { Result, Results } from "@ui/validation";
import { PCRDto, PCRItemDto, PCRItemTypeDto, ProjectDto } from "@framework/dtos";
import { EditorStatus, IEditorStore } from "@ui/redux";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators";
import { ILinkInfo, PCRItemType } from "@framework/types";
import { accountNameChangeWorkflow } from "./nameChange";
import { scopeChangeWorkflow } from "./scopeChange/scopeChangeWorkflow";
import { standardItemWorkflow } from "./standardItem/workflow";
import { timeExtensionItemWorkflow } from "@ui/containers/pcrs/timeExtension/timeExtensionWorkflow";
import { suspendProjectWorkflow } from "./suspendProject/workflow";
import { financialVirementWorkflow } from "./financialVirements/workflow";
import { BaseProps } from "../containerBase";

type InferStepsNames<T> = T extends IWorkflow<infer TDto, infer TVal, infer TStepname> ? TStepname : never;
type InferTDto<T> = T extends IWorkflow<infer TDto, infer TVal, infer TStepname> ? TDto : never;
type InferTVal<T> = T extends IWorkflow<infer TDto, infer TVal, infer TStepname> ? TVal : never;

export interface StepProps<TWorkflow> {
  project: ProjectDto;
  pcr: PCRDto;
  pcrItem: InferTDto<TWorkflow>;
  pcrItemType: PCRItemTypeDto;
  documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>;
  validator: InferTVal<TWorkflow>;
  status: EditorStatus;
  onChange: (dto: InferTDto<TWorkflow>) => void;
  onSave: () => void;
  getRequiredToCompleteMessage: (additionalMessage?: string) => React.ReactNode;
  isClient: boolean;
}

export interface SummaryProps<TWorkflow> extends BaseProps {
  projectId: string;
  pcr: PCRDto;
  pcrItem: InferTDto<TWorkflow>;
  project: ProjectDto;
  validator: InferTVal<TWorkflow>;
  mode: "prepare" | "review" | "view";
  onSave: () => void;
  getStepLink: (stepName: InferStepsNames<TWorkflow>) => ILinkInfo;
  getEditLink: (stepName: InferStepsNames<TWorkflow>, validation: Result|null) => React.ReactNode;
}

export interface IStep<T, TVal extends Results<T>, TStepName extends string> {
  stepName: TStepName;
  displayName: string;
  stepNumber: number;
  stepRender: (props: StepProps<IWorkflow<T, TVal, TStepName>>) => React.ReactNode;
}

export interface IWorkflow<T, TVal extends Results<T>, TStepName extends string> {
  steps: IStep<T, TVal, TStepName>[];
  summary: {
    summaryRender: (props: SummaryProps<IWorkflow<T, TVal, TStepName>>) => React.ReactNode;
  };
}

export interface ICallableStep<T> extends IStep<T, Results<T>, string> {

}

export interface ICallableWorkflow<T> {
  isOnSummary: () => boolean;
  getSummary: () => { summaryRender: (props: SummaryProps<IWorkflow<T, Results<T>, string>>) => React.ReactNode } | undefined;
  findStepNumberByName: (name: string) => number | undefined;
  getCurrentStepInfo: () => ICallableStep<T> | undefined;
  getCurrentStepName: () => string | undefined;
  getNextStepInfo: () => ICallableStep<T> | undefined;
  getPrevStepInfo: () => ICallableStep<T> | undefined;
}

export class WorkFlow<T, TVal extends Results<T>, TStepNames extends string> implements ICallableWorkflow<T> {
  public constructor(private definition: IWorkflow<T, TVal, TStepNames>, private stepNumber: number | undefined) { }

  public getSummary() {
    return this.isOnSummary() ? this.definition.summary : undefined;
  }

  public findStepNumberByName(stepName: string) {
    const step = this.definition.steps.find(x => x.stepName === stepName);
    if (!step) {
      throw Error("No such step in workflow");
    }
    return step.stepNumber;
  }

  public isOnSummary() {
    return !this.stepNumber;
  }

  public getNextStepInfo() {
    const nextStepNumber = this.stepNumber && this.stepNumber < this.definition.steps.length ? this.stepNumber + 1 : undefined;
    return nextStepNumber ? this.definition.steps[nextStepNumber - 1] : undefined;
  }

  public getPrevStepInfo() {
    const prevStepNumber = this.stepNumber && this.stepNumber > 1 ? this.stepNumber - 1 : undefined;
    return prevStepNumber ? this.definition.steps[prevStepNumber - 1] : undefined;
  }

  public getCurrentStepInfo() {
    if (!this.stepNumber || this.stepNumber > this.definition.steps.length) {
      return undefined;
    }
    return this.definition.steps[this.stepNumber - 1];
  }

  public getCurrentStepName() {
    const currentStep = this.getCurrentStepInfo();
    return currentStep && currentStep.stepName;
  }

  public static getWorkflow(pcrItem: PCRItemDto | undefined, step: number | undefined) {
    if (!pcrItem) {
      return null;
    }
    switch (pcrItem.type) {
      case PCRItemType.AccountNameChange:
        return new WorkFlow(accountNameChangeWorkflow, step);
      case PCRItemType.ScopeChange:
        return new WorkFlow(scopeChangeWorkflow, step);
      case PCRItemType.TimeExtension:
        return new WorkFlow(timeExtensionItemWorkflow, step);
      case PCRItemType.ProjectSuspension:
        return new WorkFlow(suspendProjectWorkflow, step);
      case PCRItemType.MultiplePartnerFinancialVirement:
        return new WorkFlow(financialVirementWorkflow, step);
      case PCRItemType.SinglePartnerFinancialVirement:
      case PCRItemType.PartnerAddition:
      case PCRItemType.PartnerWithdrawal:
        return new WorkFlow(standardItemWorkflow, step);
      default:
        return null;
    }
  }
}
