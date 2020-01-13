import { Result } from "./result";

export interface IValidationResult {
  readonly errors: Result[];
  readonly isValid: boolean;
  readonly isRequired: boolean;
}

export class Results<T> implements IValidationResult {
  public readonly errors = new Array<Result>();
  public isValid: boolean = true;

  constructor(public model: T, public readonly showValidationErrors: boolean, results: Result[] = []) {
    results.forEach(x => this.add(x));
  }

  public isRequired: boolean = false;

  /* internal dont use directly in normal behaviour as a Result adds itself to the parent Results validator */
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
    return this.errors.filter(x => !x.isValid).map(x => x.log()).join("/n");
  }

  public inspect = () => this.log();
}

export class CombinedResultsValidator extends Results<{}> {
  constructor(...vals: Results<{}>[]) {
    const errors = vals.reduce<Result[]>((a, b) => a.concat(b.errors), []);
    super({}, errors.some(x => x.showValidationErrors));
    // add the items using the internal method
    errors.forEach(x => this.add(x));
  }
}

export class CombinedResultValidator extends Results<{}> {
  constructor(...vals: Result[]) {
    super({}, vals.some(x => x.showValidationErrors));
    // add the items using the internal method
    vals.forEach(x => this.add(x));
  }
}
