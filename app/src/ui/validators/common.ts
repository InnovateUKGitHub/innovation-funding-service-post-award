// tslint:disable:no-duplicate-string
import { Results } from "../validation/results";
import { Result } from "../validation/result";
import { NestedResult } from "../validation/nestedResult";
import { isNumber } from "@framework/util";

// A helper for creating validation rules
function rule<T>(test: (value: T | null) => boolean, defaultMessage: string, isRequired?: boolean): (results: Results<{}>, value: T | null, message?: string) => Result {
  return (results: Results<{}>, value: T | null, message?: string) => {
    return new Result(results, results.showValidationErrors, test(value), message || defaultMessage, !!isRequired);
  };
}

function isValueWholeNumber(value: number): boolean {
  return (isNumber(value) && Number.isInteger(value));
}

export function valid(resultSet: Results<{}>, isRequired?: boolean) {
  return new Result(resultSet, resultSet.showValidationErrors, true, null, isRequired || false);
}

export function inValid(resultSet: Results<{}>, message: string, isRequired?: boolean) {
  return new Result(resultSet, resultSet.showValidationErrors, false, message, isRequired || false);
}

export const required = rule<any>((value) => {
  if (value === null || value === undefined) { return false; }
  if (value.__proto__ === ("" as any).__proto__) { return value.trim().length > 0; }
  if (value instanceof Array) { return value.length > 0; }
  return true;
}, "Required", true);

export function isUnchanged(results: Results<{}>, value: number | string | Date | null | undefined, originalValue: number | string | Date | null | undefined, message?: string) {
  if (!originalValue) return isTrue(results, !value, message || "Value can not be changed");
  if (typeof value === "number" && typeof originalValue === "number") return isTrue(results, value === originalValue, message || "Value can not be changed");
  if (value instanceof Date && originalValue instanceof Date) return isTrue(results, value.getTime() === originalValue.getTime(), message || "Value can not be changed");
  if (typeof value !== typeof originalValue) return inValid(results, message || "Value can not be changed");
  if (typeof value === "string") return isTrue(results, value === originalValue, message || "Value can not be changed");
  return inValid(results, message || "Value can not be changed");
}

export const isTrue = rule<boolean>((value) => value === null || value === undefined || value === true, "Should be true");
export const isFalse = rule<boolean>((value) => value === null || value === undefined || value === false, "Should be false");
export const isDate = rule<Date>((value) => value === null || value === undefined || (value.getTime && !isNaN(value.getTime())), "Invalid date");

export function maxLength(results: Results<{}>, value: string | null, length: number, message?: string) {
  return isTrue(results, (!value) || value.length <= length, message || `Maximum of ${length} characters`);
}

export function minLength(results: Results<{}>, value: string, length: number, message?: string) {
  return isTrue(results, value !== null && value.length >= length, message || `Minimum of ${length} characters`);
}

export function exactLength(results: Results<{}>, value: string, length: number, message?: string) {
  return isTrue(results, (!value) || value.length === length, message || `Must be exactly ${length} characters`);
}

export function hasNoDuplicates<T>(results: Results<{}>, values: T[], message: string) {
  const hasDuplicate = !!values.find((val, i) => values.indexOf(val) !== i);
  return isFalse(results, hasDuplicate, message);
}

export function alphanumeric(results: Results<{}>, value: string, message?: string) {
  const regex = new RegExp(/^[a-z0-9]+$/i);
  return isTrue(results, (!value) || regex.test(value), message || "Only  numbers and letters allowed");
}

export function number(results: Results<{}>, value: number | undefined | null, message?: string) {
  return isTrue(results, value === undefined || value === null || isNumber(value), message || "Field must be a number.");
}

export function integer(results: Results<{}>, value: number, message?: string) {
  return isTrue(results, value === undefined || value === null || isValueWholeNumber(value), message || "Field must be a number.");
}

export function isPositiveInteger(results: Results<{}>, value: number | undefined | null, message?: string) {
  return isTrue(results, value === undefined || value === null || (isValueWholeNumber(value) && value >= 0), message || "Field must be a positive number");
}

export function email(results: Results<{}>, value: string, message?: string) {
  // http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
  const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return isTrue(results, (!value) || regex.test(value), message || "Invalid email address");
}

export function isCurrency(results: Results<{}>, value: number | null, message?: string) {
  const regex = /^-?[0-9]+(\.[0-9]{1,2})?$/i;
  if (value === null || value === undefined || value === 0) { return valid(results); }
  return isTrue(results, !isNaN(value) && regex.test(value.toString()), message || "Invalid amount");
}

export function isPositiveCurrency(results: Results<{}>, value: number | null, message?: string) {
  const regex = /^[0-9]+(\.[0-9]{1,2})?$/i;
  if (value === null || value === undefined || value === 0) { return valid(results); }
  return isTrue(results, !isNaN(value) && regex.test(value.toString()), message || "Invalid amount");
}

// Accepts an array of delegates. Runs until it finds a failure. EG, Not empty, length < 100, no spaces. Will fail fast.
export function all(resultSet: Results<{}>, ...results: (() => Result)[]): Result {
  let isRequired = false;
  // tslint:disable-next-line
  for (let i = 0; i < results.length; i++) {
    const result = results[i]();
    // this logic presumes that the "isRequired" is set as the first validation. If it is the last one it won't be shown until prev are valid
    // however it wouldn't make much sense for the required validation to not be the first one
    if (result.isRequired) {
      isRequired = true;
    }
    if (!result.isValid) {
      return result;
    }
  }
  return valid(resultSet, isRequired);
}

// Validating lists of things allowing for overall validation
export function child<T, U extends Results<{}>>(parentResults: Results<{}>, model: T[], validateModel: (model: T) => U, listValidation: (children: ChildValidators<T>) => Result, summaryMessage?: string) {
  const listResults = listValidation(new ChildValidators(parentResults, model));
  const childResults = model ? model.map(m => validateModel(m)) : [];
  return new NestedResult(parentResults, childResults, listResults, summaryMessage);
}

// Validating lists of things, but does fail if list is empty.
export function requiredChild<T, U extends Results<{}>>(parentResults: Results<{}>, model: T[], validateModel: (model: T) => U, emptyMessage?: string, summaryMessage?: string) {
  return child<T, U>(parentResults, model, validateModel, children => children.required("At least one is required"), summaryMessage);
}

// Validating lists of things, but don't care if list is empty.
export function optionalChild<T, U extends Results<{}>>(parentResults: Results<{}>, model: T[], validateModel: (model: T) => U, summaryMessage?: string) {
  return child<T, U>(parentResults, model, validateModel, children => children.valid(), summaryMessage);
}

export function permitedValues<T>(results: Results<{}>, value: T, permitted: T[], message?: string) {
  return isTrue(results, permitted.indexOf(value) >= 0, message || "Value is not permited");
}

export class ChildValidators<T> {
  constructor(private parent: Results<{}>, private items: T[]) {
  }

  private expected<TValue>(test: (items: T[]) => TValue, expected: TValue, message: string, isRequired?: boolean) {
    return new Result(null, this.parent.showValidationErrors, test(this.items) === expected, message, isRequired || false);
  }

  public required(message?: string) {
    return this.expected(x => !!(x && x.length), true, message || "At least one is required", true);
  }

  public valid() {
    return this.expected(x => true, true, "");
  }

  public invalid(message: string) {
    return this.expected(x => false, true, message);
  }

  public isTrue(test: (items: T[]) => boolean, message?: string): Result {
    return this.expected(test, true, message || "Should be true");
  }

  public isFalse(test: (items: T[]) => boolean, message?: string): Result {
    return this.expected(test, false, message || "Should be false");
  }

  public hasNoDuplicates<TCompare = T>(getComparison?: (item: T) => TCompare, message?: string) {
    const test = (items: T[]) => {
      const mapped = this.items.map(x => getComparison ? getComparison(x) : x);
      return mapped.every((val, i) => mapped.indexOf(val) === i);
    };

    return this.isTrue(test, message || "Cannot contain duplicate times");
  }

  public all(...results: (() => Result)[]) {
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
    return this.expected(() => true, true, "", isRequired);
  }
}
