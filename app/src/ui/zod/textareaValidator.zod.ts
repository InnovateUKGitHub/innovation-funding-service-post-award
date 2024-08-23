import { isNil } from "lodash";
import { z, ZodIssueCode, ZodString } from "zod";

const defaultMaxLength = 30_000;
const defaultMinLength = 0;

/**
 * ### getTextValidation
 *
 *
 * this will match a set of validations and
 * also error messaging to ensure consistency across the app
 * and compliance with GDS
 *
 * the `label` can be either a raw string, or if it is a path that matches
 * an item in the copy document, it will be interpolated
 */
export const getTextValidation = <Required extends boolean = false>({
  maxLength = defaultMaxLength,
  minLength = defaultMinLength,
  base = z.string(),
  required,
  params = {},
}: {
  maxLength?: number;
  minLength?: number;
  base?: ZodString;
  required: Required;
  params?: AnyObject;
}) => {
  const validationRule = base
    .trim()
    .optional()
    .nullable()
    .transform((val, ctx) => {
      const valIsEmptyString = typeof val === "string" && val.trim() === "";
      const valIsNil = isNil(val);
      if (required && (valIsEmptyString || valIsNil)) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          params: {
            generic: true,
            i18n: "errors.generic.textarea.required",
            ...params,
          },
        });
        return z.NEVER;
      }

      if (!(valIsEmptyString || valIsNil)) {
        const len = val.length;

        // Something can be too big if there is some kind of limit.
        const canBeTooBig = typeof maxLength === "number";
        const tooBig = canBeTooBig && len > maxLength;

        // Something can be too small if the minimum length is not (0 or required and 1)
        const canBeTooSmall = typeof minLength === "number" && !(minLength === 0 || (required && minLength === 1));
        const tooSmall = len < minLength;

        if (canBeTooBig && canBeTooSmall && (tooBig || tooSmall)) {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            params: {
              min: minLength,
              max: maxLength,
              count: len,
              generic: true,
              i18n: "errors.generic.textarea.invalid_range",
              ...params,
            },
          });

          return z.NEVER;
        }

        // Make sure our currency isn't so big as to break our server
        if (canBeTooBig && tooBig) {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            params: {
              count: maxLength,
              generic: true,
              i18n: "errors.generic.textarea.too_big",
              ...params,
            },
          });
          return z.NEVER;
        }

        if (canBeTooSmall && tooSmall) {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            params: {
              count: minLength,
              generic: true,
              i18n: "errors.generic.textarea.too_small",
              ...params,
            },
          });
          return z.NEVER;
        }
      }

      if (valIsEmptyString) {
        return "";
      }

      if (valIsNil) {
        return undefined;
      }

      return val;
    });

  return validationRule as unknown as Required extends true
    ? z.ZodEffects<z.ZodString, string, string | undefined | null>
    : z.ZodEffects<z.ZodString, string | undefined, string | undefined | null>;
};
