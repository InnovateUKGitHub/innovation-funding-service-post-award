import { Results } from "./results";
import { Result } from "./result";

export class NestedResult<T extends Results<{}>> extends Result {
  constructor(parentResults: Results<{}>, results: T[], listValidation: Result, summaryMessage?: string) {

    const listValidationInvalid = listValidation && !listValidation.isValid;
    const itemValidationInvalid = results.length && results.some(x => !x.isValid) || false;

    const isValid = !listValidationInvalid && !itemValidationInvalid;
    const message = (listValidationInvalid ? listValidation.errorMessage : summaryMessage) || "Validation failed";

    super(
      parentResults,
      parentResults.showValidationErrors,
      isValid,
      message,
      listValidation.isRequired || results.some(x => x.isRequired)
    );

    this.results = results;
    this.listValidation = listValidation;
  }

  public readonly results: T[];
  public readonly listValidation: Result;

  public log() {
    if (this.isValid) return null;
    return this.errorMessage! + "/n/t" + this.results.filter(x => !x.isValid).map(x => x.log()).join("/n/t");
  }
}
