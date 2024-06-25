import { parseCurrency, validCurrencyRegex } from "@framework/util/numberHelper";
import { isNil } from "lodash";
import { z, ZodIssueCode } from "zod";

const defaultMaxCurrency = 999_999_999_999;
const defaultMinCurrency = 0;

/**
 * ### getGenericCurrencyValidation
 *
 *
 * this will match a set of validations and
 * also error messaging to ensure consistency across the app
 * and compliance with GDS
 *
 * the `label` can be either a raw string, or if it is a path that matches
 * an item in the copy document, it will be interpolated
 */
export const getGenericCurrencyValidation = ({
  label,
  max = defaultMaxCurrency,
  min = defaultMinCurrency,
  required = false,
}: {
  /**
   * path to value in copy document to be interpolated, or if not matched, then the label will be shown as is
   */
  label: string;
  max?: number;
  min?: number;
  required?: boolean;
}) =>
  z
    .string()
    .trim()
    .nullable()
    .superRefine((val, ctx) => {
      const currency = parseCurrency(val);
      const isEmpty = (typeof val === "string" && val.trim() === "") || isNil(val);
      if (required && isEmpty) {
        return ctx.addIssue({
          code: ZodIssueCode.custom,
          params: {
            label,
            generic: ["currency"],
            i18n: "errors.required",
          },
        });
      }

      if (!isEmpty) {
        if (/[\$€¥]+/.test(val)) {
          return ctx.addIssue({
            code: ZodIssueCode.custom,
            params: {
              label,
              generic: ["currency"],
              i18n: "errors.not_pounds",
            },
          });
        }
        // Check if the string can even be parsed
        if (isNaN(currency)) {
          return ctx.addIssue({
            code: ZodIssueCode.custom,
            params: {
              label,
              generic: ["currency"],
              i18n: "errors.not_a_number",
            },
          });
        }

        // Make sure our currency isn't so big as to break our server
        if (currency > max) {
          return ctx.addIssue({
            code: ZodIssueCode.custom,
            params: {
              label,
              count: max,
              generic: ["currency"],
              i18n: "errors.too_big",
            },
          });
        }

        if (currency < min) {
          return ctx.addIssue({
            code: ZodIssueCode.custom,
            params: {
              label,
              count: min,
              generic: ["currency"],
              i18n: "errors.too_small",
            },
          });
        }
        if (/\.\d\d\d/.test(val)) {
          return ctx.addIssue({
            code: ZodIssueCode.custom,
            params: {
              label,
              generic: ["currency"],
              i18n: "errors.two_decimal_places",
            },
          });
        }

        if (!validCurrencyRegex.test(val)) {
          return ctx.addIssue({
            code: ZodIssueCode.custom,
            params: {
              label,
              generic: ["currency"],
              i18n: "errors.invalid_currency",
            },
          });
        }
      }
    })
    .transform(x => {
      if ((typeof x === "string" && x.trim() === "") || isNil(x)) {
        return null;
      }
      return x;
    });