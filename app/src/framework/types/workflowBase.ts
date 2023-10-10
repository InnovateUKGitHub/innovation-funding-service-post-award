import React from "react";
import { ILinkInfo } from "./ILinkInfo";
import { PCRStepType } from "@framework/constants/pcrConstants";
import { numberComparator } from "@framework/util/comparator";
import { Results } from "@ui/validation/results";

export type MigratedSummaryProps = {
  getStepLink: (stepName: PCRStepType) => ILinkInfo;
  getEditLink: (stepName: PCRStepType) => React.ReactElement;
  getViewLink: (stepName: PCRStepType) => React.ReactElement;
  allowSubmit: boolean;
  displayCompleteForm: boolean;
};

export type IStepProps = AnyObject;
export type ISummaryProps = AnyObject;

export interface IStep<
  TStepName extends string,
  TStepProps extends IStepProps,
  TVal extends Results<ResultBase> | undefined,
> {
  stepName: TStepName;
  displayName: string;
  stepNumber: number;
  validation?: TVal extends undefined ? never : (val: TVal) => Results<ResultBase>;
  stepRender?: (props: TStepProps) => React.ReactElement;
  readonlyStepRender?: (props: TStepProps) => React.ReactElement;
  migratedStepRender?: () => React.ReactElement;
  migratedReadonlyStepRender?: () => React.ReactElement;
  isMigratedToGql?: boolean;
}

interface ISummary<TSummaryProps, TVal extends Results<ResultBase> | undefined> {
  validation?: TVal extends undefined ? never : (val: TVal) => Results<ResultBase>;
  summaryRender?: (props: TSummaryProps) => React.ReactElement;
  migratedSummaryRender?: (props: MigratedSummaryProps) => React.ReactElement;
  isMigratedToGql?: boolean;
}
export interface IWorkflow<
  TStepName extends string,
  TStepProps extends IStepProps,
  TSummaryProps extends ISummaryProps,
  TVal extends Results<ResultBase> | undefined,
> {
  steps: IStep<TStepName, TStepProps, TVal>[];
  summary?: ISummary<TSummaryProps, TVal>;
  migratedSummary?: ISummary<MigratedSummaryProps, undefined>;
  isMigratedToGql?: boolean;
}

export type ICallableStep<TStepProps extends IStepProps, TVal extends Results<ResultBase> | undefined> = IStep<
  string,
  TStepProps,
  TVal
>;

export interface ICallableWorkflow<
  TStepProps extends IStepProps,
  TSummaryProps extends ISummaryProps,
  TVal extends Results<ResultBase> | undefined,
> {
  isOnSummary: () => boolean;
  getSummary: () => { summaryRender?: (props: TSummaryProps) => React.ReactNode } | undefined;
  getMigratedSummary: () => { migratedSummaryRender?: (props: MigratedSummaryProps) => React.ReactNode } | undefined;
  findStepNumberByName: (name: string) => number | undefined;
  getCurrentStepInfo: () => ICallableStep<TStepProps, TVal> | undefined;
  getCurrentStepName: () => string | undefined;
  getNextStepInfo: () => ICallableStep<TStepProps, TVal> | undefined;
  getPrevStepInfo: () => ICallableStep<TStepProps, TVal> | undefined;
  getValidation: (validators: TVal) => Results<ResultBase> | undefined;
}

export abstract class WorkflowBase<
  TStepNames extends string,
  TStepProps extends IStepProps,
  TSummaryProps extends ISummaryProps,
  TVal extends Results<ResultBase> | undefined,
> implements ICallableWorkflow<TStepProps, TSummaryProps, TVal>
{
  private readonly steps: IStep<TStepNames, TStepProps, TVal>[];
  public readonly isMigratedToGql?: boolean;
  private readonly summary?: ISummary<TSummaryProps, TVal>;
  private readonly migratedSummary?: ISummary<MigratedSummaryProps, undefined> | undefined;

  protected constructor(
    definition: IWorkflow<TStepNames, TStepProps, TSummaryProps, TVal>,
    private readonly stepNumber: number | undefined,
  ) {
    this.isMigratedToGql = definition.isMigratedToGql;
    this.steps = definition.steps;
    this.steps.sort((a, b) => numberComparator(a.stepNumber, b.stepNumber));
    this.summary = definition.summary;
    this.migratedSummary = definition.migratedSummary;
  }

  public getSummary() {
    return this.isOnSummary() ? this.summary : undefined;
  }

  public getMigratedSummary() {
    return this.isOnSummary() ? this.migratedSummary : undefined;
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
    if (!validators) {
      return;
    }
    if (this.isOnSummary()) {
      const summary = this.getSummary();
      return summary && summary.validation && summary.validation(validators);
    }
    const step = this.getCurrentStepInfo();
    return step && step.validation && step.validation(validators);
  }
}
