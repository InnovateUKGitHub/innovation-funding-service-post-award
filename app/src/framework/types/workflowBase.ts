import { numberComparator } from "@framework/util/comparator";
import { Results } from "@ui/validation/results";
import React from "react";
import { GraphQLTaggedNode, OperationType } from "relay-runtime";

export type IStepProps = AnyObject;
export type ISummaryProps = AnyObject;
type QueryIfAvailable<TQuery extends OperationType | undefined = undefined> = TQuery extends undefined
  ? { gqlQuery: TQuery }
  : Record<string, never>;

export interface IStep<TStepName extends string, TStepProps extends IStepProps, TVal extends Results<ResultBase>> {
  stepName: TStepName;
  displayName: string;
  stepNumber: number;
  validation: (val: TVal) => Results<ResultBase>;
  stepRender: (props: TStepProps) => React.ReactElement;
  readonlyStepRender?: (props: TStepProps) => React.ReactElement;
}

interface ISummary<TSummaryProps, TVal extends Results<ResultBase>> {
  validation: (val: TVal) => Results<ResultBase>;
  summaryRender: (props: TSummaryProps) => React.ReactElement;
}
export interface IWorkflow<
  TStepName extends string,
  TStepProps extends IStepProps,
  TSummaryProps extends ISummaryProps,
  TVal extends Results<ResultBase>,
  TQuery extends OperationType | undefined = undefined,
> {
  steps: IStep<TStepName, TStepProps & QueryIfAvailable<TQuery>, TVal>[];
  summary: ISummary<TSummaryProps & QueryIfAvailable<TQuery>, TVal>;
  gqlQuery: TQuery extends undefined ? undefined : GraphQLTaggedNode;
}

export type ICallableStep<TStepProps extends IStepProps, TVal extends Results<ResultBase>> = IStep<
  string,
  TStepProps,
  TVal
>;

export interface ICallableWorkflow<
  TStepProps extends IStepProps,
  TSummaryProps extends ISummaryProps,
  TVal extends Results<ResultBase>,
  TQuery extends OperationType | undefined = undefined,
> {
  isOnSummary: () => boolean;
  getSummary: () => { summaryRender: (props: TSummaryProps & QueryIfAvailable<TQuery>) => React.ReactNode } | undefined;
  findStepNumberByName: (name: string) => number | undefined;
  getCurrentStepInfo: () => ICallableStep<TStepProps & QueryIfAvailable<TQuery>, TVal> | undefined;
  getCurrentStepName: () => string | undefined;
  getNextStepInfo: () => ICallableStep<TStepProps & QueryIfAvailable<TQuery>, TVal> | undefined;
  getPrevStepInfo: () => ICallableStep<TStepProps & QueryIfAvailable<TQuery>, TVal> | undefined;
  getValidation: (validators: TVal) => Results<ResultBase> | undefined;
}

export abstract class WorkflowBase<
  TStepNames extends string,
  TStepProps extends IStepProps,
  TSummaryProps extends ISummaryProps,
  TVal extends Results<ResultBase>,
  TQuery extends OperationType | undefined = undefined,
> implements ICallableWorkflow<TStepProps, TSummaryProps, TVal, TQuery>
{
  private readonly steps: IStep<TStepNames, TStepProps & QueryIfAvailable<TQuery>, TVal>[];
  private readonly summary: ISummary<TSummaryProps & QueryIfAvailable<TQuery>, TVal>;

  protected constructor(
    definition: IWorkflow<TStepNames, TStepProps, TSummaryProps, TVal, TQuery>,
    private readonly stepNumber: number | undefined,
  ) {
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
