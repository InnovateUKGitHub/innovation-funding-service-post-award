import React from "react";
import { numberComparator } from "@framework/util";
import { Results } from "@ui/validation";

export interface IStepProps {}
export interface ISummaryProps {}

export interface IStep<TStepName extends string, TStepProps extends IStepProps, TVal extends Results<{}>> {
  stepName: TStepName;
  displayName: string;
  stepNumber: number;
  validation: (val: TVal) => Results<any>;
  stepRender: (props: TStepProps) => React.ReactNode;
  readonlyStepRender?: (props: TStepProps) => React.ReactNode;
}

interface ISummary<TSummaryProps, TVal extends Results<{}>> {
  validation: (val: TVal) => Results<any>;
  summaryRender: (props: TSummaryProps) => React.ReactNode;
}
export interface IWorkflow<TStepName extends string, TStepProps extends IStepProps, TSummaryProps extends ISummaryProps, TVal extends Results<{}>> {
  steps: IStep<TStepName, TStepProps, TVal>[];
  summary: ISummary<TSummaryProps, TVal>;
}

export interface ICallableStep<TStepProps extends IStepProps, TVal extends Results<{}>> extends IStep<string, TStepProps, TVal> {}

export interface ICallableWorkflow<TStepProps extends IStepProps, TSummaryProps extends ISummaryProps, TVal extends Results<{}>> {
  isOnSummary: () => boolean;
  getSummary: () => { summaryRender: (props: TSummaryProps) => React.ReactNode } | undefined;
  findStepNumberByName: (name: string) => number | undefined;
  getCurrentStepInfo: () => ICallableStep<TStepProps, TVal> | undefined;
  getCurrentStepName: () => string | undefined;
  getNextStepInfo: () => ICallableStep<TStepProps, TVal> | undefined;
  getPrevStepInfo: () => ICallableStep<TStepProps, TVal> | undefined;
  getValidation: (validators: TVal) => Results<{}> | undefined;
}

export abstract class WorkflowBase<TStepNames extends string, TStepProps extends IStepProps, TSummaryProps extends ISummaryProps, TVal extends Results<{}>> implements ICallableWorkflow<TStepProps, TSummaryProps, TVal> {
  private readonly steps: IStep<TStepNames, TStepProps, TVal>[];
  private readonly summary: ISummary<TSummaryProps, TVal>;

  protected constructor(definition: IWorkflow<TStepNames, TStepProps, TSummaryProps, TVal>, private readonly stepNumber: number | undefined) {
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

  public getValidation(validators: TVal) {
    if (this.isOnSummary()) {
      const summary = this.getSummary();
      return summary && summary.validation && summary.validation(validators);
    }
    const step = this.getCurrentStepInfo();
    return step && step.validation && step.validation(validators);
  }
}
