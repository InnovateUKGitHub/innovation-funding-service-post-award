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
import { Logger } from "./developmentLogger";

const logger = new Logger("zodi18n");

const joinValues = <T extends unknown[]>(array: T, separator = " | "): string =>
  array.map(val => (typeof val === "string" ? `'${val}'` : val)).join(separator);

export type ZodI18nMapOption = {
  t?: i18n["t"];
  ns?: string | readonly string[];
  keyPrefix: string[];
};

const defaultNs = "zod";

export const makeZodI18nMap =
  (option?: ZodI18nMapOption): ZodErrorMap =>
  (issue, ctx) => {
    const { t, ns, keyPrefix } = {
      t: i18next.t,
      ns: defaultNs,
      keyPrefix: [],
      ...option,
    };

    /**
     * Create all permutations of valid i18n translation keys.
     * e.g. if the prefix was "agadoo.push.pineapple" and keys[] was ["hello", "world"]
     *
     * ```
     * 1. "agadoo.push.pineapple.hello"
     * 2. "agadoo.push.pineapple.world"
     * 3. "agadoo.push.hello"
     * 4. "agadoo.push.world"
     * 5. "agadoo.hello"
     * 6. "agadoo.world"
     * 7. "errors.invalid"
     * ```
     *
     * @param keys List of keys to attempt.
     * @returns An array of all combinations of keys to attempt to use to translate.
     */
    const makeKey = (...keys: string[]): string[] => {
      const paths: string[] = [];
      const alternativeKeys = [...keys, "errors.invalid"];
      const fullPrefix = [...keyPrefix, ...issue.path];

      for (let i = fullPrefix.length; i >= 0; i--) {
        for (const key of alternativeKeys) {
          const path = ["forms", ...fullPrefix.slice(0, i), key];
          paths.push(path.join("."));
        }
      }

      logger.debug("Translating error with one of the following keys", paths, issue);

      return paths;
    };

    let message: string;
    message = defaultErrorMap(issue, ctx).message;

    switch (issue.code) {
      case ZodIssueCode.invalid_type:
        message = t(makeKey(`errors.invalid_type_received_${issue.received}`, "errors.invalid_type"), {
          ns,
          expected: t(`types.${issue.expected}`, {
            defaultValue: issue.expected,
            ns,
          }),
          received: t(`types.${issue.received}`, {
            defaultValue: issue.received,
            ns,
          }),
        });
        break;
      case ZodIssueCode.invalid_literal:
        message = t(makeKey("errors.invalid_literal"), {
          expected: JSON.stringify(issue.expected),
          ns,
        });
        break;
      case ZodIssueCode.unrecognized_keys:
        message = t(makeKey("errors.unrecognized_keys"), {
          keys: joinValues(issue.keys, ", "),
          count: issue.keys.length,
          ns,
        });
        break;
      case ZodIssueCode.invalid_union:
        message = t(makeKey("errors.invalid_union"), {
          ns,
        });
        break;
      case ZodIssueCode.invalid_union_discriminator:
        message = t(makeKey("errors.invalid_union_discriminator"), {
          options: joinValues(issue.options),
          ns,
        });
        break;
      case ZodIssueCode.invalid_enum_value:
        message = t(makeKey("errors.invalid_enum_value"), {
          options: joinValues(issue.options),
          received: issue.received,
          ns,
        });
        break;
      case ZodIssueCode.invalid_arguments:
        message = t(makeKey("errors.invalid_arguments"), {
          ns,
        });
        break;
      case ZodIssueCode.invalid_return_type:
        message = t(makeKey("errors.invalid_return_type"), {
          ns,
        });
        break;
      case ZodIssueCode.invalid_date:
        message = t(makeKey("errors.invalid_date"), {
          ns,
        });
        break;
      case ZodIssueCode.invalid_string:
        if (typeof issue.validation === "object") {
          if ("startsWith" in issue.validation) {
            message = t(makeKey(`errors.invalid_string.startsWith`), {
              startsWith: issue.validation.startsWith,
              ns,
            });
          } else if ("endsWith" in issue.validation) {
            message = t(makeKey(`errors.invalid_string.endsWith`), {
              endsWith: issue.validation.endsWith,
              ns,
            });
          }
        } else {
          message = t(makeKey(`errors.invalid_string.${issue.validation}`), {
            validation: t(`validations.${issue.validation}`, {
              defaultValue: issue.validation,
              ns,
            }),
            ns,
          });
        }
        break;
      case ZodIssueCode.too_small:
        const minimum = issue.type === "date" ? new Date(issue.minimum as number) : issue.minimum;
        message = t(makeKey(`errors.too_small`), {
          minimum,
          count: typeof minimum === "number" ? minimum : undefined,
          ns,
        });
        break;
      case ZodIssueCode.too_big:
        const maximum = issue.type === "date" ? new Date(issue.maximum as number) : issue.maximum;
        message = t(makeKey(`errors.too_big`), {
          maximum,
          count: typeof maximum === "number" ? maximum : undefined,
          ns,
        });
        break;
      case ZodIssueCode.custom:
        message = t(makeKey(issue.params?.i18n ?? "errors.custom"), {
          ...issue.params,
          ns,
        });
        break;
      case ZodIssueCode.invalid_intersection_types:
        message = t(makeKey("errors.invalid_intersection_types"), {
          ns,
        });
        break;
      case ZodIssueCode.not_multiple_of:
        message = t(makeKey("errors.not_multiple_of"), {
          multipleOf: issue.multipleOf,
          ns,
        });
        break;
      case ZodIssueCode.not_finite:
        message = t(makeKey("errors.not_finite"), {
          ns,
        });
        break;
      default:
    }

    return { message };
  };