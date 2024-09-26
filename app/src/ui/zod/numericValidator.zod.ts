import { isNil } from "lodash";
import { z, ZodIssueCode } from "zod";

const defaultMax = 999_999_999_999;
const defaultMin = 0;

/**
 * if `required` return type is `"number"`
 * if not `required` return type is `"null | number"`
 */
type NullableIfNotRequired<Required extends boolean> = Required extends true
  ? z.ZodEffects<z.ZodEffects<z.ZodNumber>>
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
    z.ZodEffects<z.ZodEffects<z.ZodOptional<z.ZodNullable<z.ZodAny>>, any, any>, number | null, any>;

/**
 * ### getNumericValidation
 *
 * this will match a set of validations and
 * also error messaging to ensure consistency across the app
 * and compliance with GDS and is for evaluating numeric values
 *
 */
export const getNumberValidation = <T extends boolean>({
  max = defaultMax,
  min = defaultMin,
  lt, // less than
  gt, // greater than
  required,
  integer, // will reject if input not an integer
  showValidRange, // will cause the error to show both min and max values
  decimalPlaces, // will have an error that shows the maximum allowed decimal places. Only works with string type values
}: {
  max?: number;
  min?: number;
  lt?: number;
  gt?: number;
  required: T;
  integer?: boolean;
  showValidRange?: boolean;
  decimalPlaces?: number;
}): NullableIfNotRequired<T> =>
  z
    .any()
    .nullable()
    .optional()
    .superRefine((rawVal, ctx) => {
      /*
       * run the required check first
       */
      const isEmpty = isNil(rawVal);
      if (required && isEmpty) {
        return ctx.addIssue({
          code: ZodIssueCode.custom,
          params: {
            generic: true,
            i18n: "errors.generic.number.required",
          },
        });
      }

      /*
       * run the rest of the checks
       */
      if (!isEmpty) {
        /*
         * if we have a decimal places check, run this. This only makes sense on string types
         */
        if (typeof rawVal === "string" && !isNil(decimalPlaces)) {
          const decimalPlacesRegex = /\d+\.(\d*)?/;
          const match = rawVal.match(decimalPlacesRegex);
          if (match) {
            const decimalPlacesMatch = match[1];
            if (decimalPlacesMatch?.length > decimalPlaces) {
              return ctx.addIssue({
                code: ZodIssueCode.custom,
                params: {
                  generic: true,
                  i18n: "errors.generic.number.decimal_places",
                  count: decimalPlaces,
                },
              });
            }
          }
        }

        /*
         * convert the value to number type
         */
        let val: number;

        if (typeof rawVal === "number") {
          val = rawVal;
        } else {
          val = Number(rawVal);
        }

        /*
         * reject if not a number
         */
        if (isNaN(val)) {
          return ctx.addIssue({
            code: ZodIssueCode.custom,
            params: {
              generic: true,
              i18n: "errors.generic.number.invalid_type",
            },
          });
        }

        /*
         * check for integer if this is required
         */
        if (integer && !Number.isInteger(val)) {
          return ctx.addIssue({
            code: ZodIssueCode.custom,
            params: {
              generic: true,
              i18n: "errors.generic.number.not_integer",
            },
          });
        }

        /*
         * if show valid range is passed in then the error message shows both
         * min and max allowed values
         */
        if (showValidRange) {
          if (val < min || val > max) {
            return ctx.addIssue({
              code: ZodIssueCode.custom,
              params: {
                min,
                max,
                count: min === 1 && max === 1 ? 1 : 2,
                generic: true,
                i18n: "errors.generic.number.invalid_range",
              },
            });
          }
        } else {
          /*
           * reject if too big
           */
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

          /*
           * also check for less than
           */
          if (typeof lt === "number" && val >= lt) {
            return ctx.addIssue({
              code: ZodIssueCode.custom,
              params: {
                count: lt,
                generic: true,
                i18n: "errors.generic.number.less_than",
              },
            });
          }

          /*
           * check for too small
           */
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

          /*
           * check for greater than
           */
          if (typeof gt === "number" && val <= gt) {
            return ctx.addIssue({
              code: ZodIssueCode.custom,
              params: {
                count: lt,
                generic: true,
                i18n: "errors.generic.number.greater_than",
              },
            });
          }
        }
      }
    })
    .transform(val => {
      /*
       * transform result into number type or null
       */
      if (!required && isNil(val)) {
        return null;
      } else if (typeof val === "number") {
        return val;
      } else {
        return Number(val);
      }
    }) as NullableIfNotRequired<T>;
