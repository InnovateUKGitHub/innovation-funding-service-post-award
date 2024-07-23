import { isNil } from "lodash";
import { z, ZodIssueCode } from "zod";

const defaultMaxLength = 30_000;
const defaultMinLength = 0;

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
export const getTextareaValidation = ({
  label,
  maxLength = defaultMaxLength,
  minLength = defaultMinLength,
  required = false,
}: {
  /**
   * path to value in copy document to be interpolated, or if not matched, then the label will be shown as is
   */
  label: string;
  maxLength?: number;
  minLength?: number;
  required?: boolean;
}) =>
  z
    .string()
    .trim()
    .optional()
    .nullable()
    .superRefine((val, ctx) => {
      const isEmpty = (typeof val === "string" && val.trim() === "") || isNil(val);
      if (required && isEmpty) {
        return ctx.addIssue({
          code: ZodIssueCode.custom,
          params: {
            label,
            generic: ["textarea"],
            i18n: "errors.required",
          },
        });
      }

      if (!isEmpty) {
        // Make sure our currency isn't so big as to break our server
        if (val?.length > maxLength) {
          return ctx.addIssue({
            code: ZodIssueCode.custom,
            params: {
              label,
              count: maxLength,
              generic: ["textarea"],
              i18n: "errors.too_big",
            },
          });
        }

        if (val?.length < minLength) {
          return ctx.addIssue({
            code: ZodIssueCode.custom,
            params: {
              label,
              count: minLength,
              generic: ["textarea"],
              i18n: "errors.too_small",
            },
          });
        }
      }
    })
    .transform(x => {
      if ((typeof x === "string" && x.trim() === "") || isNil(x)) {
        return undefined;
      }
      return x;
    });
