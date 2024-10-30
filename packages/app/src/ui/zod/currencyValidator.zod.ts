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
 */
export const getGenericCurrencyValidation = ({
  max = defaultMaxCurrency,
  min = defaultMinCurrency,
  required,
}: {
  max?: number;
  min?: number;
  required: boolean;
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
            generic: true,
            i18n: "errors.generic.currency.required",
          },
        });
      }

      if (!isEmpty) {
        if (/[\$€¥]+/.test(val)) {
          return ctx.addIssue({
            code: ZodIssueCode.custom,
            params: {
              generic: true,
              i18n: "errors.generic.currency.not_pounds",
            },
          });
        }
        // Check if the string can even be parsed
        if (isNaN(currency)) {
          return ctx.addIssue({
            code: ZodIssueCode.custom,
            params: {
              generic: true,
              i18n: "errors.generic.currency.not_a_number",
            },
          });
        }

        // Make sure our currency isn't so big as to break our server
        if (currency > max) {
          return ctx.addIssue({
            code: ZodIssueCode.custom,
            params: {
              count: max,
              generic: true,
              i18n: "errors.generic.currency.too_big",
            },
          });
        }

        if (currency < min) {
          return ctx.addIssue({
            code: ZodIssueCode.custom,
            params: {
              count: min,
              generic: true,
              i18n: "errors.generic.currency.too_small",
            },
          });
        }
        if (/\.\d\d\d/.test(val)) {
          return ctx.addIssue({
            code: ZodIssueCode.custom,
            params: {
              generic: true,
              i18n: "errors.generic.currency.two_decimal_places",
            },
          });
        }

        if (!validCurrencyRegex.test(val)) {
          return ctx.addIssue({
            code: ZodIssueCode.custom,
            params: {
              generic: true,
              i18n: "errors.generic.currency.invalid_currency",
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
