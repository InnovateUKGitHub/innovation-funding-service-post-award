/**
 *  MIT License
 *
 *  Copyright (c) 2021 AijiUejima
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 */

import i18next, { i18n } from "i18next";
import { ZodErrorMap, ZodIssueCode, defaultErrorMap } from "zod";

const joinValues = <T extends unknown[]>(array: T, separator = " | "): string =>
  array.map(val => (typeof val === "string" ? `'${val}'` : val)).join(separator);

export type ZodI18nMapOption = {
  t?: i18n["t"];
  ns?: string | readonly string[];
  keyPrefix: string[];
  context?: unknown;
};

const defaultNs = "default";

const flattenCopyString = (key: (string | number | (string | number)[])[]): string =>
  key
    .map(x => (Array.isArray(x) ? flattenCopyString(x) : x))
    .filter(x => x !== "")
    .join(".");

const convertCopyKeyToArrayType = (key: (string | number)[]): string[] =>
  key.map(x => (typeof x === "number" || /^\d+$/.test(x) ? "arrayType" : String(x)));

/**
 * ## generatePossibleCopyStrings
 * Create every possible ContentSelector automatically by returning an
 * array of all possible fullKey combinations (keyPrefix + issue.path)
 *
 * ### Scenario
 * ```js
 * makeZodI18nMap({ keyPrefix: ['abcd', 'efgh' ]});
 *
 * z.object({
 *   money: z.number() // Error lies here
 * });
 * ```
 *
 * An error in the above `money` object would look something like this...
 * ```text
 * | namespace | keyPrefix | issue.path | issue code          | issue type  |
 * | forms     | abcd.efgh |   money    | errors.invalid_type | number      |
 * | --------- | ---------------------- | ------------------- | ----------- |
 * |           |        fullKey         |                     |             |
 * | forms     |     abcd.efgh.money    | errors.invalid_type | number      |
 * ```
 *
 * Which this function would then return...
 * 1. `forms.abcd.efgh.money.errors.invalid_type.number`
 * 1. `forms.abcd.efgh.money.errors.invalid_type`
 * 1. `forms.abcd.efgh.errors.invalid_type.number`
 * 1. `forms.abcd.efgh.errors.invalid_type`
 * 1. `forms.abcd.errors.invalid_type.number`
 * 1. `forms.abcd.errors.invalid_type`
 * 1. `forms.errors.invalid_type.number`
 * 1. `forms.errors.invalid_type`
 */
const generatePossibleCopyStrings = ({
  namespace,
  fullKey,
  issueCodes,
  issueType,
}: {
  namespace: string;
  fullKey: (string | number)[];
  issueCodes: string[];
  issueType?: string;
}) => {
  /**
   * 1. Try with `issue.type` and not manipulating the `fullKey`
   * 2. Try without `issue.type` and not manipulating the `fullKey`
   * 3. Try with `issue.type` and replacing numbers with `arrayType`
   * 4. Try without `issue.type` and replacing numbers with `arrayType`
   *
   * Go to 1, but remove the last item in fullKey to look further up.
   */

  const paths: string[] = [];

  const addToPath = (x: (string | number | (string | number)[])[]) => paths.push(flattenCopyString(x));

  // Cut down on the search by reducing the number of bits of the
  // `fullKey` we are looking for.
  for (let i = fullKey.length; i >= 0; i--) {
    const subsection = fullKey.slice(0, i);
    const hasNumberKey = subsection.some(x => typeof x === "number" || /^\d+$/.test(x));

    // Run a round without replacing numbers with `arrayType`
    // Then, run a round with replacing.
    const shouldConvertArrayTypesCombinations = hasNumberKey ? [false, true] : [false];
    for (const shouldConvertArrayTypes of shouldConvertArrayTypesCombinations) {
      const convertedSubsection = shouldConvertArrayTypes ? convertCopyKeyToArrayType(subsection) : subsection;

      // If an issueType exists...
      // Run a round with the issueType at the end, then a round without.
      // Otherwise, run a round without.
      const shouldAppendIssueTypeCombinations = typeof issueType === "string" ? [true, false] : [false];
      for (const shouldAppendIssueType of shouldAppendIssueTypeCombinations) {
        // Try each possible issueCode
        for (const issueCode of issueCodes) {
          const key: (string | number | (string | number)[])[] = [];

          key.push(namespace);
          key.push(convertedSubsection);
          key.push(issueCode);
          if (shouldAppendIssueType && typeof issueType === "string") {
            key.push(issueType);
          }

          addToPath(key);
        }
      }
    }
  }

  return paths;
};

export const makeZodI18nMap =
  (option?: ZodI18nMapOption): ZodErrorMap =>
  (issue, zodIssueContext) => {
    // Set default options
    const { t, ns, keyPrefix, context } = {
      t: i18next.t,
      ns: defaultNs,
      keyPrefix: [],
      context: {},
      ...option,
    };

    // Setup interpreted values
    const baseInterpValues = {
      ns,
      input: zodIssueContext.data,
      context,
      issue,
    };

    const makeKey = (...issueCodes: string[]) =>
      generatePossibleCopyStrings({
        namespace: "forms",
        fullKey: [...keyPrefix, ...issue.path],
        issueCodes,
        issueType: "type" in issue ? issue.type : undefined,
      });

    const interpValues = {
      ...baseInterpValues,
      label: t(makeKey("label"), { ...baseInterpValues }),
    };

    let message: string;
    message = defaultErrorMap(issue, zodIssueContext).message;

    switch (issue.code) {
      case ZodIssueCode.invalid_type:
        message = t(makeKey(`errors.invalid_type_received_${issue.received}`, "errors.invalid_type"), {
          ...interpValues,
          expected: t(`types.${issue.expected}`, {
            defaultValue: issue.expected,
            ...interpValues,
          }),
          received: t(`types.${issue.received}`, {
            defaultValue: issue.received,
            ...interpValues,
          }),
        });
        break;
      case ZodIssueCode.invalid_literal:
        message = t(makeKey("errors.invalid_literal"), {
          expected: JSON.stringify(issue.expected),
          ...interpValues,
        });
        break;
      case ZodIssueCode.unrecognized_keys:
        message = t(makeKey("errors.unrecognized_keys"), {
          keys: joinValues(issue.keys, ", "),
          count: issue.keys.length,
          ...interpValues,
        });
        break;
      case ZodIssueCode.invalid_union:
        message = t(makeKey("errors.invalid_union"), {
          ...interpValues,
        });
        break;
      case ZodIssueCode.invalid_union_discriminator:
        message = t(makeKey("errors.invalid_union_discriminator"), {
          options: joinValues(issue.options),
          ...interpValues,
        });
        break;
      case ZodIssueCode.invalid_enum_value:
        message = t(makeKey("errors.invalid_enum_value"), {
          options: joinValues(issue.options),
          received: issue.received,
          ...interpValues,
        });
        break;
      case ZodIssueCode.invalid_arguments:
        message = t(makeKey("errors.invalid_arguments"), {
          ...interpValues,
        });
        break;
      case ZodIssueCode.invalid_return_type:
        message = t(makeKey("errors.invalid_return_type"), {
          ...interpValues,
        });
        break;
      case ZodIssueCode.invalid_date:
        message = t(makeKey("errors.invalid_date"), {
          ...interpValues,
        });
        break;
      case ZodIssueCode.invalid_string:
        if (typeof issue.validation === "object") {
          if ("startsWith" in issue.validation) {
            message = t(makeKey("errors.invalid_string.startsWith"), {
              startsWith: issue.validation.startsWith,
              ...interpValues,
            });
          } else if ("endsWith" in issue.validation) {
            message = t(makeKey("errors.invalid_string.endsWith"), {
              endsWith: issue.validation.endsWith,
              ...interpValues,
            });
          }
        } else {
          message = t(makeKey(`errors.invalid_string.${issue.validation}`), {
            validation: t(`validations.${issue.validation}`, {
              defaultValue: issue.validation,
              ...interpValues,
            }),
            ...interpValues,
          });
        }
        break;
      case ZodIssueCode.too_small:
        const minimum = issue.type === "date" ? new Date(issue.minimum as number) : issue.minimum;
        message = t(makeKey("errors.too_small"), {
          minimum,
          count: typeof minimum === "number" ? minimum : undefined,
          ...interpValues,
        });
        break;
      case ZodIssueCode.too_big:
        const maximum = issue.type === "date" ? new Date(issue.maximum as number) : issue.maximum;
        message = t(makeKey("errors.too_big"), {
          maximum,
          count: typeof maximum === "number" ? maximum : undefined,
          ...interpValues,
        });
        break;
      case ZodIssueCode.custom:
        message = t(makeKey(issue.params?.i18n ?? "errors.custom"), {
          ...issue.params,
          ...interpValues,
        });
        break;
      case ZodIssueCode.invalid_intersection_types:
        message = t(makeKey("errors.invalid_intersection_types"), {
          ...interpValues,
        });
        break;
      case ZodIssueCode.not_multiple_of:
        message = t(makeKey("errors.not_multiple_of"), {
          multipleOf: issue.multipleOf,
          ...interpValues,
        });
        break;
      case ZodIssueCode.not_finite:
        message = t(makeKey("errors.not_finite"), {
          ...interpValues,
        });
        break;
      default:
    }

    return { message };
  };

export { flattenCopyString, convertCopyKeyToArrayType, generatePossibleCopyStrings };
