import { Result } from "./result";

export class Results<T> {
    public readonly errors = new Array<Result>();

    constructor(public model: T, public readonly showValidationErrors: boolean) {
    }

    isValid() {
        return this.errors.length === 0;
    }

    public isRequired: boolean = false;

    /* internal */
    private add(result: Result) {
        if (!result.isValid) {
            this.errors.push(result);
        }
        if (result.isRequired) {
            this.isRequired = true;
        }
    }
}
