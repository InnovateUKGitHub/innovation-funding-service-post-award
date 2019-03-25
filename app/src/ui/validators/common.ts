// tslint:disable:no-duplicate-string
import { Results } from "../validation/results";
import { Result } from "../validation/result";
import { NestedResult } from "../validation/nestedResult";
import { isNumber } from "../../util/NumberHelper";

// A helper for creating validation rules
function rule<T>(test: (value: T) => boolean, defaultMessage: string, isRequired?: boolean): (results: Results<{}>, value: T, message?: string) => Result {
    return (results: Results<{}>, value: T, message?: string) => {
        return new Result(results, results.showValidationErrors, test(value), message || defaultMessage, !!isRequired);
    };
}

export function valid(resultSet: Results<{}>, isRequired?: boolean) {
    return new Result(resultSet, resultSet.showValidationErrors, true, null, isRequired || false);
}

export function inValid(resultSet: Results<{}>, message: string, isRequired?: boolean) {
    return new Result(resultSet, resultSet.showValidationErrors, false, message, isRequired || false);
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
    return isTrue(results, (!value) || value.length <= length, message || `Maximum of ${length} characters`);
}

export function minLength(results: Results<{}>, value: string, length: number, message?: string) {
    return isTrue(results, value !== null && value.length >= length, message || `Minimum of ${length} characters`);
}

export function exactLength(results: Results<{}>, value: string, length: number, message?: string) {
    return isTrue(results, (!value) || value.length === length, message || `Must be exactly ${length} characters`);
}

export function alphanumeric(results: Results<{}>, value: string, message?: string) {
    const regex = new RegExp(/^[a-z0-9]+$/i);
    return isTrue(results, (!value) || regex.test(value), message || "Only  numbers and letters allowed");
}

export function number(results: Results<{}>, value: number, message?: string) {
    return isTrue(results, value === undefined || value === null || isNumber(value), message || "Field must be a number.");
}

export function email(results: Results<{}>, value: string, message?: string) {
    // http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
    const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return isTrue(results, (!value) || regex.test(value), message || "Invalid email address");
}

export function isCurrency(results: Results<{}>, value: number|null, message?: string) {
    const regex = /^-?[0-9]+(\.[0-9]{2})?$/i;
    if(value === null || value === undefined) { return valid(results); }
    return isTrue(results, (!value) || regex.test(value.toString()), message || "Invalid amount");
}

// Accepts an array of delegates. Runs until it finds a failure. EG, Not empty, length < 100, no spaces. Will fail fast.
export function all(resultSet: Results<{}>, ...results: (() => Result)[]): Result {
    let isRequired = false;
    // tslint:disable-next-line
    for (let i = 0; i < results.length; i++) {
        const result = results[i]();
        // this logic presumes that the is required is set as the first validation. If it sthe last one it wont be shown untill prev are valid
        // however it wouldnt make much sense for the required validation to not be the first one
        if (result.isRequired) {
            isRequired = true;
        }
        if (!result.isValid) {
            return result;
        }
    }
    return valid(resultSet, isRequired);
}

// Validating lists of things, but does fail if list is empty.
export function requiredChild<T, U extends Results<{}>>(parentResults: Results<{}>, model: T[], validateModel: (model: T) => U, emptyMessage?: string, summaryMessage?: string) {
    const childResults = model ? model.map(m => validateModel(m)) : [];
    return new NestedResult(parentResults, childResults, true, emptyMessage || "At least one is required", summaryMessage);
}

// Validating lists of things, but don't care if list is empty.
export function optionalChild<T, U extends Results<{}>>(parentResults: Results<{}>, model: T[], validateModel: (model: T) => U , summaryMessage?: string) {
    const childResults = model ? model.map(m => validateModel(m)) : [];
    return new NestedResult(parentResults, childResults, false, "", summaryMessage);
}
