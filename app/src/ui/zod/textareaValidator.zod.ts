import { PossibleCopyKeys } from "@copy/type";
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
export const getTextareaValidation = <T = PossibleCopyKeys, Required extends boolean = false>({
  label,
  maxLength = defaultMaxLength,
  minLength = defaultMinLength,
  required,
}: {
  /**
   * path to value in copy document to be interpolated, or if not matched, then the label will be shown as is
   */
  label: T;
  maxLength?: number;
  minLength?: number;
  required: Required;
}) => {
  const validationRule = z
    .string()
    .trim()
    .optional()
    .transform((val, ctx) => {
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

      if ((typeof val === "string" && val.trim() === "") || isNil(val)) {
        return undefined;
      }

      return val;
    });

  return validationRule as unknown as Required extends true
    ? z.ZodEffects<z.ZodString, string, string | undefined>
    : z.ZodEffects<z.ZodString, string | undefined, string | undefined>;
};
