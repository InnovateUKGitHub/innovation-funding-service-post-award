import React from "react";
import { numberComparator } from "@framework/util";
import { NotFoundError } from "@server/features/common";

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
  private readonly steps: IStep<TStepNames, TStepProps>[];
  private readonly summary: { summaryRender: (props: TSummaryProps) => React.ReactNode; };

  protected constructor(definition: IWorkflow<TStepNames, TStepProps, TSummaryProps>, private stepNumber: number | undefined) {
    if (stepNumber && !definition.steps.find(x => x.stepNumber === stepNumber)) {
      throw new NotFoundError();
    }
    this.steps = definition.steps;
    this.steps.sort((a, b) => numberComparator(a.stepNumber, b.stepNumber));
    this.summary = definition.summary;
  }

  public getSummary() {
    return this.isOnSummary() ? this.summary : undefined;
  }

  public findStepNumberByName(stepName: string) {
    const step = this.steps.find(x => x.stepName === stepName);
    if (!step) {
      throw Error("No such step in workflow");
    }
    return step.stepNumber;
  }

  public isOnSummary() {
    return !this.stepNumber;
  }

  private getCurrentStepIndex() {
    return this.steps.findIndex(x => x.stepNumber === this.stepNumber);
  }

  public getNextStepInfo() {
    const currentIndex = this.getCurrentStepIndex();
    if (currentIndex < 0) return undefined;
    return this.steps[currentIndex + 1];
  }

  public getPrevStepInfo() {
    // If on the summary return the last step
    if (this.isOnSummary()) {
      return this.steps[this.steps.length - 1];
    }
    const currentIndex = this.getCurrentStepIndex();
    if (currentIndex < 0) return undefined;
    return this.steps[currentIndex - 1];
  }

  public getCurrentStepInfo() {
    const currentIndex = this.getCurrentStepIndex();
    if (currentIndex < 0) return undefined;
    return this.steps[currentIndex];
  }

  public getCurrentStepName() {
    const currentStep = this.getCurrentStepInfo();
    return currentStep && currentStep.stepName;
  }
}
