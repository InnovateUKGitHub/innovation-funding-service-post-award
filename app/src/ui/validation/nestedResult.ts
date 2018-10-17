import { Results } from "./results";
import { Result } from "./result";

export class NestedResult<T extends Results<{}>> extends Result {
    constructor(parentResults: Results<{}>, public readonly results: T[], isRequired: boolean, emptyMessage: string, summaryMessage: string | undefined) {
        super(
            parentResults,
            parentResults.showValidationErrors,
            results && results.length ? results.every(x => x.isValid) : !isRequired,
            results && results.length ? summaryMessage || "Validation failed" : emptyMessage,
            results.some(x => x.isRequired)
        );
    }
}
