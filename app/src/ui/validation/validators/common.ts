import { DateTime } from "luxon";
import { Results } from "../results";
import { Result } from "../result";
import { Nested, NestedResult } from "../nestedResult";
import { dayComparator } from "@framework/util/comparator";
import { isNumber } from "@framework/util/numberHelper";

export type ValidatableValue = number | string | Date | null | boolean | undefined;

/**
 * Helper function to create validation rules
 */
function rule<T>(
  test: (value: T | null) => boolean,
  defaultMessage: string,
  isRequired?: boolean,
): (results: Results<ResultBase>, value: T | null, message?: string, keyId?: string) => Result {
  return (results: Results<ResultBase>, value: T | null, message?: string, keyId?: string) => {
    return new Result(
      results,
      results.showValidationErrors,
      test(value),
      message || defaultMessage,
      !!isRequired,
      keyId,
    );
  };
}

/**
 * validates that value is an integer
 */
function isValueWholeNumber(value: number): boolean {
  return isNumber(value) && Number.isInteger(value);
}

/**
 * returns a result with validation applied
 */
export function valid(resultSet: Results<ResultBase>, isRequired?: boolean, keyId?: string) {
  return new Result(resultSet, resultSet.showValidationErrors, true, null, isRequired || false, keyId);
}

/**
 * Validating invalid
 */
export function inValid(resultSet: Results<ResultBase>, message: string, isRequired?: boolean) {
  return new Result(resultSet, resultSet.showValidationErrors, false, message, isRequired || false);
}

export const required = rule<unknown>(
  value => {
    if (value === null || value === undefined) {
      return false;
    }
    // if (value.__proto__ === ("" as unknown as { __proto__: StringConstructor }).__proto__) {
    //   return (value as string).trim().length > 0;
    // }
    if (typeof value === "string") {
      return value.trim().length > 0;
    }
    if (value instanceof Array) {
      return value.length > 0;
    }
    return true;
  },
  "Required",
  true,
);

/**
 * Validating values are unchanged
 */
export function isUnchanged(
  results: Results<ResultBase>,
  value: ValidatableValue,
  originalValue: ValidatableValue,
  message?: string,
) {
  if (!originalValue) return isTrue(results, !value, message || "Value can not be changed");
  if (typeof value === "number" && typeof originalValue === "number")
    return isTrue(results, value === originalValue, message || "Value can not be changed");
  if (value instanceof Date && originalValue instanceof Date)
    return isTrue(results, value.getTime() === originalValue.getTime(), message || "Value can not be changed");
  if (typeof value !== typeof originalValue) return inValid(results, message || "Value can not be changed");
  if (typeof value === "string" || typeof value === "boolean")
    return isTrue(results, value === originalValue, message || "Value can not be changed");
  return inValid(results, message || "Value can not be changed");
}

export const isTrue = rule<boolean>(
  value => value === null || value === undefined || value === true,
  "Should be true",
  false,
);
export const isFalse = rule<boolean>(
  value => value === null || value === undefined || value === false,
  "Should be false",
);
export const isDate = rule<Date>(value => {
  return (
    value === null ||
    value === undefined ||
    (value.getFullYear() > 1999 && // let's hope nothing from last millennium
      value.getFullYear() < 2200) // remember to update this in around 160 years
  );
}, "Invalid date");

/**
 *  Tests that the day is before or on the test date. Disregards time of day.
 */
export function isBeforeOrSameDay(results: Results<ResultBase>, value: Date | null, test: Date, message?: string) {
  if (!value || !test) return valid(results);
  return isTrue(
    results,
    dayComparator(value, test) <= 0,
    message || `Date must be on or before ${test && DateTime.fromJSDate(test).toFormat("d MMM yyyy")}`,
  );
}

/**
 * validates against max length
 */
export function maxLength(
  results: Results<ResultBase>,
  value: string | null,
  length: number,
  message?: string,
  keyId?: string,
) {
  return isTrue(results, !value || value.length <= length, message || `Maximum of ${length} characters`, keyId);
}

/**
 * validates against min length
 */
export function minLength(results: Results<ResultBase>, value: string, length: number, message?: string) {
  return isTrue(results, value !== null && value.length >= length, message || `Minimum of ${length} characters`);
}

/**
 * validates against exact length
 */
export function exactLength(results: Results<ResultBase>, value: string, length: number, message?: string) {
  return isTrue(results, !value || value.length === length, message || `Must be exactly ${length} characters`);
}

/**
 * validates against no duplicates
 */
export function hasNoDuplicates<T>(results: Results<ResultBase>, values: T[], message: string) {
  const hasDuplicate = !!values.find((val, i) => values.indexOf(val) !== i);
  return isFalse(results, hasDuplicate, message);
}

/**
 * validates is alphanumeric
 */
export function alphanumeric(results: Results<ResultBase>, value: string, message?: string) {
  const regex = new RegExp(/^[a-z0-9]+$/i);
  return isTrue(results, !value || regex.test(value), message || "Only numbers and letters allowed");
}

/**
 * validates is a number
 */
export function number(
  results: Results<ResultBase>,
  value: number | undefined | null,
  message?: string,
  keyId?: string,
) {
  return isTrue(
    results,
    value === undefined || value === null || isNumber(value),
    message || "Field must be a number.",
    keyId,
  );
}

/**
 * validates is an integer
 */
export function integer(results: Results<ResultBase>, value?: number | null, message?: string, keyId?: string) {
  return isTrue(
    results,
    value === undefined || value === null || isValueWholeNumber(value),
    message || "Field must be a number.",
    keyId,
  );
}

/**
 * validates is a positive integer
 */
export function isPositiveInteger(results: Results<ResultBase>, value: number | undefined | null, message?: string) {
  return isTrue(
    results,
    value === undefined || value === null || (isValueWholeNumber(value) && value >= 0),
    message || "Field must be a positive number",
  );
}

/**
 * validates is a valid sort code
 */
export function sortCode(results: Results<ResultBase>, value: string | null, message?: string, keyId?: string) {
  const regex = new RegExp(/^\d{6}$/);
  return isTrue(results, !value || regex.test(value), message || "Invalid sort code", keyId);
}

/**
 * validates is a valid account number
 */
export function accountNumber(results: Results<ResultBase>, value: string | null, message?: string, keyId?: string) {
  const regex = new RegExp(/^\d{6,8}$/);
  return isTrue(results, !value || regex.test(value), message || "Invalid account number", keyId);
}

/**
 * validates is a valid email
 */
export function email(results: Results<ResultBase>, value: string, message?: string) {
  // http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
  const regex =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
  return isTrue(results, !value || regex.test(value), message || "Invalid email address");
}

/**
 * validates is a currency type
 */
export function isCurrency(results: Results<ResultBase>, value: number | null, message?: string, keyId?: string) {
  const regex = /^-?[0-9]+(\.[0-9]{1,2})?$/i;
  if (value === null || value === undefined || value === 0) {
    return valid(results);
  }
  return isTrue(results, !isNaN(value) && regex.test(value.toString()), message || "Invalid amount", keyId);
}

/**
 * validates is a positive floating point
 */
export function isPositiveFloat(results: Results<ResultBase>, value: number | null, message?: string) {
  if (!value) {
    return valid(results);
  }
  const isCurrencyValue = Math.sign(value);
  return isPositiveInteger(results, isCurrencyValue, message || "You must put a positive currency value");
}

/**
 * validates is a percentage
 */
export function isPercentage(results: Results<ResultBase>, value: number | null, message?: string) {
  const regex = /^[0-9]+(\.[0-9]{1,2})?$/i;
  if (value === null || value === undefined || value === 0) {
    return valid(results);
  }
  return isTrue(
    results,
    !isNaN(value) && regex.test(value.toString()),
    message || "You must enter a number with up to 2 decimal places",
  );
}

/**
 * Accepts an array of delegates. Runs until it finds a failure. EG, Not empty, length < 100, no spaces. Will fail fast.
 */
export function all(resultSet: Results<ResultBase>, ...results: (() => Result)[]): Result {
  let isRequired = false;
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

/**
 * Validating nested object
 */
export function nested<T, U extends Results<ResultBase>>(
  parentResults: Results<ResultBase>,
  model: T,
  validateModel: (model: T) => U,
  summaryMessage?: string,
) {
  return new Nested(parentResults, validateModel(model), summaryMessage);
}

/**
 * Validating lists of things allowing for overall validation
 */
export function child<T, U extends Results<ResultBase>>(
  parentResults: Results<ResultBase>,
  model: T[],
  validateModel: (model: T) => U,
  listValidation: (children: ChildValidators<T>) => Result,
  summaryMessage?: string,
  keyId?: string,
) {
  const listResults = listValidation(new ChildValidators(parentResults, model));
  const childResults = model ? model.map(m => validateModel(m)) : [];
  return new NestedResult(parentResults, childResults, listResults, summaryMessage, keyId);
}

/**
 * Validating lists of things, but does fail if list is empty.
 */
export function requiredChild<T, U extends Results<ResultBase>>(
  parentResults: Results<ResultBase>,
  model: T[],
  validateModel: (model: T) => U,
  emptyMessage?: string,
  summaryMessage?: string,
) {
  return child<T, U>(
    parentResults,
    model,
    validateModel,
    children => children.required("At least one is required"),
    summaryMessage,
  );
}

/**
 * Validating lists of things, but don't care if list is empty.
 */
export function optionalChild<T, U extends Results<ResultBase>>(
  parentResults: Results<ResultBase>,
  model: T[],
  validateModel: (model: T) => U,
  summaryMessage?: string,
  keyId?: string,
) {
  return child<T, U>(parentResults, model, validateModel, children => children.valid(), summaryMessage, keyId);
}

/**
 * Validating all values match against list of permitted values
 */
export function permittedValues<T>(
  results: Results<ResultBase>,
  value: T,
  permitted: T[] | Readonly<T[]>,
  message?: string,
) {
  return isTrue(results, permitted.indexOf(value) >= 0, message || "Value is not permitted");
}

export class ChildValidators<T> {
  constructor(private readonly parent: Results<ResultBase>, private readonly items: T[]) {}

  private expected<TValue>(test: (items: T[]) => TValue, expected: TValue, message: string, isRequired?: boolean) {
    return new Result(
      null,
      this.parent.showValidationErrors,
      test(this.items) === expected,
      message,
      isRequired || false,
    );
  }

  public required(message?: string) {
    return this.expected(x => !!(x && x.length), true, message || "At least one is required", true);
  }

  public valid() {
    return this.expected(() => true, true, "");
  }

  public invalid(message: string) {
    return this.expected(() => false, true, message);
  }

  public isTrue(test: (items: T[]) => boolean, message?: string): Result {
    return this.expected(test, true, message || "Should be true");
  }

  public isFalse(test: (items: T[]) => boolean, message?: string): Result {
    return this.expected(test, false, message || "Should be false");
  }

  public hasMatchingValue<TCompare = T>(
    expectedValue: TCompare | TCompare[],
    getComparison: (item: T) => TCompare,
    errorMessage: (itemComparison: TCompare[]) => string,
  ): Result {
    const listToCheck = this.items.map(getComparison);
    const crossCheckList = Array.isArray(expectedValue) ? expectedValue : [expectedValue];
    const inValidMatchingList = listToCheck.filter(valueToCheck => crossCheckList.includes(valueToCheck));

    const hasNoMatchingItems = !inValidMatchingList.length;

    return this.isTrue(() => hasNoMatchingItems, errorMessage(inValidMatchingList));
  }

  public hasNoDuplicates<TCompare = T>(getComparison?: (item: T) => TCompare, message?: string) {
    const test = () => {
      const mapped = this.items.map(x => (getComparison ? getComparison(x) : x));
      return mapped.every((val, i) => mapped.indexOf(val) === i);
    };

    return this.isTrue(test, message || "Cannot contain duplicate times");
  }

  public all(...results: (() => Result)[]) {
    let isRequired = false;
    for (let i = 0; i < results.length; i++) {
      const result = results[i]();
      // this logic presumes that the is required is set as the first validation. If it sthe last one it wont be shown untill prev are valid
      // however it wouldn't make much sense for the required validation to not be the first one
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
