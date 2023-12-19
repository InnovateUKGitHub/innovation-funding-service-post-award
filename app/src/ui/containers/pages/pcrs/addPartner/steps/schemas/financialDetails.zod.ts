import { isEmptyDate, isValidMonth, isValidYear } from "@framework/validation-helpers/date";
import { positiveNumberInput } from "@ui/zod/helperValidators.zod";
import { z } from "zod";

/**
 * this structure required to make sure the super refined fields are validated simultaneously with the other fields
 */
const dateSecuredRequired = z
  .object({
    financialYearEndDate_month: z.string(),
    financialYearEndDate_year: z.string(),
  })
  .superRefine((data, ctx) => {
    if (isEmptyDate(data.financialYearEndDate_month, data.financialYearEndDate_year)) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 1,
        inclusive: true,
        type: "date",
        path: ["financialYearEndDate"],
      });
    }
    if (!isEmptyDate(data.financialYearEndDate_month, data.financialYearEndDate_year)) {
      if (!isValidMonth(data.financialYearEndDate_month) || !isValidYear(data.financialYearEndDate_year)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["financialYearEndDate"],
        });
      }
    }
  });

const dateSecuredOptional = z
  .object({
    financialYearEndDate_month: z.string().optional(),
    financialYearEndDate_year: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!isEmptyDate(data.financialYearEndDate_month, data.financialYearEndDate_year)) {
      if (!isValidMonth(data.financialYearEndDate_month) || !isValidYear(data.financialYearEndDate_year)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["financialYearEndDate"],
        });
      }
    }
  });

export const getFinanceDetailsSchema = (markedAsComplete: boolean) =>
  markedAsComplete
    ? z
        .object({
          button_submit: z.string(),
          financialYearEndTurnover: positiveNumberInput,
        })
        .and(dateSecuredRequired)
    : z
        .object({
          button_submit: z.string(),
          financialYearEndTurnover: positiveNumberInput.nullable(),
        })
        .and(dateSecuredOptional);

export type FinanceDetailsSchema = z.infer<ReturnType<typeof getFinanceDetailsSchema>>;
