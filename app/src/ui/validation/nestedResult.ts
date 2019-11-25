import { Results } from "./results";
import { Result } from "./result";

export class NestedResult<T extends Results<{}>> extends Result {
  constructor(parentResults: Results<{}>, public readonly results: T[], public listValidation: Result, summaryMessage?: string) {
    super(
      parentResults,
      parentResults.showValidationErrors,
      listValidation && !listValidation.isValid ? false : results && results.length ? results.every(x => x.isValid) : true,
      listValidation && !listValidation.isValid ? listValidation.errorMessage : summaryMessage || "Validation failed",
      results.some(x => x.isRequired),
      listValidation && !listValidation.isValid
    );
  }

  public log() {
    if (this.isValid) return null;
    return this.errorMessage! + "/n/t" + this.results.filter(x => !x.isValid).map(x => x.log()).join("/n/t");
  }
}
