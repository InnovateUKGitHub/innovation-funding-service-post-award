import React from "react";

export interface IStepProps {}
export interface ISummaryProps {}

export interface IStep<TStepName extends string, TStepProps extends IStepProps> {
  stepName: TStepName;
  displayName: string;
  stepNumber: number;
  stepRender: (props: TStepProps) => React.ReactNode;
}

export interface IWorkflow<TStepName extends string, TStepProps extends IStepProps, TSummaryProps extends ISummaryProps> {
  steps: IStep<TStepName, TStepProps>[];
  summary: {
    summaryRender: (props: TSummaryProps) => React.ReactNode;
  };
}

export interface ICallableStep<TStepProps extends IStepProps> extends IStep<string, TStepProps> {}

export interface ICallableWorkflow<TStepProps extends IStepProps, TSummaryProps extends ISummaryProps> {
  isOnSummary: () => boolean;
  getSummary: () => { summaryRender: (props: TSummaryProps) => React.ReactNode } | undefined;
  findStepNumberByName: (name: string) => number | undefined;
  getCurrentStepInfo: () => ICallableStep<TStepProps> | undefined;
  getCurrentStepName: () => string | undefined;
  getNextStepInfo: () => ICallableStep<TStepProps> | undefined;
  getPrevStepInfo: () => ICallableStep<TStepProps> | undefined;
}

export abstract class WorkflowBase<TStepNames extends string, TStepProps extends IStepProps, TSummaryProps extends ISummaryProps> implements ICallableWorkflow<TStepProps, TSummaryProps> {
  protected constructor(private definition: IWorkflow<TStepNames, TStepProps, TSummaryProps>, private stepNumber: number | undefined) {
  }

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
}
