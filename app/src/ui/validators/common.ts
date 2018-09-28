
interface ResultsInternal {
    _showValidationErrors: boolean;
    add(result: Result): void;
}

export class Results<T> {
    /* internal */
    // tslint:disable-next-line
    private _showValidationErrors = true;
    // tslint:disable-next-line
    private _isRequired = false;

    errors = new Array<Result>();

    constructor(public model: T, showValidationErrors: boolean) {
        this._showValidationErrors = showValidationErrors;
    }

    showValidationErrors() {
        return this._showValidationErrors;
    }

    isValid() {
        return this.errors.length === 0;
    }

    isRequired() {
        return this._isRequired;
    }

    /* internal */
    private add(result: Result) {
        if (!result.isValid()) {
            this.errors.push(result);
        }
        if (result.isRequired()) {
            this._isRequired = true;
        }
    }
}

// A single validation result, typically for a single field
export class Result {
    // tslint:disable-next-line
    private _isValid = true;
    // tslint:disable-next-line
    private _isRequired = false;
    // tslint:disable-next-line
    private _showValidationErrors = false;
    errorMessage: string|null = null;

    constructor(results: Results<{}>|null, showValidationErrors: boolean, isValid: boolean, errorMessage: string|null , isRequired: boolean) {

        // Cast so that the internal methods can be private on the public interface.
        const internalResults = (results as any) as ResultsInternal;

        this._showValidationErrors = showValidationErrors;
        this._isValid = isValid;
        this._isRequired = isRequired;

        this.errorMessage = errorMessage;

        if (internalResults) {
            internalResults.add(this);
        }
    }

    combine(other: Result) {
        return new Result(null, this.showValidationErrors() || other.showValidationErrors(), this.isValid() && other.isValid(), this.errorMessage || other.errorMessage || "", this.isRequired() || other.isRequired());
    }

    isValid() {
        return this._isValid;
    }

    showValidationErrors() {
        return this._showValidationErrors;
    }

    isRequired() {
        return this._isRequired;
    }
}

// A helper for creating validation rules
function rule<T>(test: (value: T) => boolean, defaultMessage: string, isRequired?: boolean): (results: Results<{}>, value: T, message?: string) => Result {
    return (results: Results<{}>, value: T, message?: string) => {
        return new Result(results, results.showValidationErrors(), test(value), message || defaultMessage, !!isRequired);
    };
}

export function valid(resultSet: Results<{}>, isRequired?: boolean) {
    return new Result(resultSet, resultSet.showValidationErrors(), true, null, isRequired || false);
}

export function inValid(resultSet: Results<{}>, message: string, isRequired?: boolean) {
    return new Result(resultSet, resultSet.showValidationErrors(), false, message, isRequired || false);
}

export let required = rule<any>((value) => {
    if (value === null || value === undefined) { return false; }
    if (value.__proto__ === ("" as any).__proto__) { return value.trim().length > 0; }
    if (value instanceof Array) { return value.length > 0; }
    return true;
}, "Required", true);

export const isTrue = rule<boolean>((value) => value === null || value === undefined || value === true, "Should be true");
export const isFalse = rule<boolean>((value) => value === null || value === undefined || value === false, "Should be false");
export const isDate = rule<Date>((value) => value === null || value === undefined || (value.getTime && !isNaN(value.getTime())), "Invalid date");

export function maxLength(results: Results<{}>, value: string|null, length: number, message?: string) {
    // tslint:disable-next-line
    return isTrue(results, (!value) || value.length <= length, message || "Maximum of " + length + " characters");
}

export function minLength(results: Results<{}>, value: string, length: number, message?: string) {
    // tslint:disable-next-line
    return isTrue(results, value !== null && value.length >= length, message || "Minimum of " + length + " characters");
}

export function exactLength(results: Results<{}>, value: string, length: number, message?: string) {
    // tslint:disable-next-line
    return isTrue(results, (!value) || value.length === length, message || "Must be exactly " + length + " characters");
}

export function alphanumeric(results: Results<{}>, value: string, message?: string) {
    const regex = new RegExp(/^[a-z0-9]+$/i);
    return isTrue(results, (!value) || regex.test(value), message || "Only  numbers and letters allowed");
}

export function email(results: Results<{}>, value: string, message?: string) {
    // http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
    const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return isTrue(results, (!value) || regex.test(value), message || "Invalid email address");
}

export function nonZeroNumber(results: Results<{}>, value: number, message?: string) {
    return isTrue(results, value !== null && value !== 0, message || "Non-zero numbers only");
}

// Accepts an array of delegates. Runs until it finds a failure. EG, Not empty, length < 100, no spaces. Will fail fast.
export function all(resultSet: Results<{}>, ...results: (() => Result)[]): Result {
    let isRequired = false;
    // tslint:disable-next-line
    for (let i = 0; i < results.length; i++) {
        const result = results[i]();
        // this logic presumes that the is required is set as the first validation. If it sthe last one it wont be shown untill prev are valid
        // however it wouldnt make much sense for the required validation to not be the first one
        if (result.isRequired()) {
            isRequired = true;
        }
        if (!result.isValid()) {
            return inValid(resultSet, result.errorMessage!, isRequired);
        }
    }
    return valid(resultSet, isRequired);
}
