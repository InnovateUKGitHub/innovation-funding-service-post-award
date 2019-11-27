import { Results } from "./results";

interface ResultsInternal {
    add(result: Result): void;
}

let valSeed = 0;

// A single validation result, typically for a single field
export class Result {
    constructor(
        results: Results<{}> | null,
        public readonly showValidationErrors: boolean,
        public readonly isValid: boolean,
        public readonly errorMessage: string | null,
        public readonly isRequired: boolean,
    ) {
        const internalResults = (results as any) as ResultsInternal;

        if (internalResults) {
            internalResults.add(this);
        }

        this.key = "Val" + valSeed;
        valSeed++;
    }

    public readonly key: string;

    public combine(other: Result) {
        return new Result(
            null,
            this.showValidationErrors || other.showValidationErrors,
            this.isValid && other.isValid,
            this.errorMessage || other.errorMessage || "",
            this.isRequired || other.isRequired
        );
    }

    public log() {
        if (this.isValid) return null;
        return this.errorMessage!;
    }
}
