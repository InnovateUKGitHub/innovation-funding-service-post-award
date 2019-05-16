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

    public log() {
        if(this.isValid) return null;
        return this.errorMessage! + "/n/t" + this.results.filter(x => !x.isValid).map(x => x.log()).join("/n/t");
    }
}
