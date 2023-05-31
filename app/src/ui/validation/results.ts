import { Copy } from "@copy/Copy";
import { Result } from "./result";

export interface IValidationResult {
  readonly errors: Result[];
  readonly isValid: boolean;
  readonly isRequired: boolean;
}

export class Results<T> implements IValidationResult {
  public readonly errors = new Array<Result>();
  public isValid = true;
  public model: T;
  public readonly showValidationErrors: boolean;
  private readonly copy: Copy;
  results: Result[];

  constructor({
    model,
    showValidationErrors,
    results = [],
    competitionType,
  }: {
    model: T;
    showValidationErrors: boolean;
    results?: Result[];
    competitionType?: string;
  }) {
    this.model = model;
    this.showValidationErrors = showValidationErrors;
    this.results = results;
    this.copy = new Copy({ competitionType });
    results.forEach(x => this.add(x));
  }

  public isRequired = false;

  public getContent(...props: Parameters<Copy["getCopyString"]>) {
    return this.copy.getCopyString(...props);
  }

  /* internal don't use directly in normal behaviour as a Result adds itself to the parent Results validator */
  protected add(result: Result) {
    if (!result.isValid) {
      this.isValid = false;
      this.errors.push(result);
    }
    if (result.isRequired) {
      this.isRequired = true;
    }
  }

  public log() {
    return this.errors
      .filter(x => !x.isValid)
      .map(x => x.log())
      .join("\n");
  }

  public inspect = () => this.log();
}

export class CombinedResultsValidator extends Results<ResultBase> {
  constructor(...vals: Results<ResultBase>[]) {
    const errors = vals.reduce<Result[]>((a, b) => a.concat(b.errors), []);
    super({ model: {}, showValidationErrors: errors.some(x => x.showValidationErrors) });
    // add the items using the internal method
    errors.forEach(x => this.add(x));
  }
}

export class CombinedResultValidator extends Results<ResultBase> {
  constructor(...vals: Result[]) {
    super({ model: {}, showValidationErrors: vals.some(x => x.showValidationErrors) });
    // add the items using the internal method
    vals.forEach(x => this.add(x));
  }
}
