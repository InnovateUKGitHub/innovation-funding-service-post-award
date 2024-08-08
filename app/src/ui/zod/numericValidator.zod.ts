import { isNil } from "lodash";
import { z, ZodIssueCode } from "zod";

const defaultMax = 999_999_999_999;
const defaultMin = 0;

/**
 * ### getNumericValidation
 *
 *
 * this will match a set of validations and
 * also error messaging to ensure consistency across the app
 * and compliance with GDS and is for evaluating numeric values
 *
 */
export const getNumberValidation = ({
  max = defaultMax,
  min = defaultMin,
  required,
}: {
  max?: number;
  min?: number;
  required: boolean;
}) =>
  z
    .any()
    .nullable()
    .optional()
    .superRefine((val, ctx) => {
      const isEmpty = isNil(val);
      if (required && isEmpty) {
        return ctx.addIssue({
          code: ZodIssueCode.custom,
          params: {
            generic: true,
            i18n: "errors.generic.number.required",
          },
        });
      }

      if (!isEmpty) {
        // Check if the number is valid
        if (isNaN(val)) {
          return ctx.addIssue({
            code: ZodIssueCode.custom,
            params: {
              generic: true,
              i18n: "errors.generic.number.invalid_type",
            },
          });
        }

        // Make sure our number isn't too big
        if (val > max) {
          return ctx.addIssue({
            code: ZodIssueCode.custom,
            params: {
              count: max,
              generic: true,
              i18n: "errors.generic.number.too_big",
            },
          });
        }

        if (val < min) {
          return ctx.addIssue({
            code: ZodIssueCode.custom,
            params: {
              count: min,
              generic: true,
              i18n: "errors.generic.number.too_small",
            },
          });
        }
      }
    });
