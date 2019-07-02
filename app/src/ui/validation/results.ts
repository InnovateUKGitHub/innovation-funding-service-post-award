import { Result } from "./result";

export class Results<T> {
    public readonly errors = new Array<Result>();
    public isValid: boolean = true;

    constructor(public model: T, public readonly showValidationErrors: boolean) {
    }

    public isRequired: boolean = false;

    /* internal */
    private add(result: Result) {
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
