import { parseCurrency, validCurrencyRegex } from "@framework/util/numberHelper";
import { isNil } from "lodash";
import { z, ZodIssueCode } from "zod";

const defaultMaxCurrency = 999_999_999_999;
const defaultMinCurrency = 0;

export const getGenericCurrencyValidation = ({
  label,
  max = defaultMaxCurrency,
  min = defaultMinCurrency,
  required = false,
}: {
  label: string;
  max?: number;
  min?: number;
  required?: boolean;
}) => {
  return z
    .string()
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
      return parseCurrency(x);
    });
};
