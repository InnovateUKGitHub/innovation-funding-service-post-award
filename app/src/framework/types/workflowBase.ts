import React from "react";
import { numberComparator } from "@framework/util/comparator";

export interface IStep<TStepName extends string> {
  stepName: TStepName;
  displayName: string;
  stepNumber: number;
  stepRender?: () => React.ReactElement;
  readonlyStepRender?: () => React.ReactElement;
}

interface ISummary {
  summaryRender?: () => React.ReactElement;
}
export interface IWorkflow<TStepName extends string> {
  steps: IStep<TStepName>[];
  summary?: ISummary;
}

export type ICallableStep = IStep<string>;

export interface ICallableWorkflow {
  isOnSummary: () => boolean;
  getSummary: () => { summaryRender?: () => React.ReactNode } | undefined;
  findStepNumberByName: (name: string) => number | undefined;
  getCurrentStepInfo: () => ICallableStep | undefined;
  getCurrentStepName: () => string | undefined;
  getNextStepInfo: () => ICallableStep | undefined;
  getPrevStepInfo: () => ICallableStep | undefined;
}

export abstract class WorkflowBase<TStepNames extends string> implements ICallableWorkflow {
  private readonly steps: IStep<TStepNames>[];

  private readonly summary?: ISummary | undefined;

  protected constructor(definition: IWorkflow<TStepNames>, private readonly stepNumber: number | undefined) {
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
