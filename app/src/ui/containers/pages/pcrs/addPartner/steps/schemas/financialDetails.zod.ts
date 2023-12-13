import { isEmptyDate, isValidMonth, isValidYear } from "@framework/validation-helpers/date";
import { positiveNumberInput } from "@ui/zod/helperValidators.zod";
import { z } from "zod";

export const getFinanceDetailsSchema = (markedAsComplete: boolean) =>
  markedAsComplete
    ? z
        .object({
          button_submit: z.string(),
          financialYearEndTurnover: positiveNumberInput.nullable(),
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
        })
    : z
        .object({
          button_submit: z.string(),
          financialYearEndTurnover: positiveNumberInput.nullable(),
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

export type FinanceDetailsSchema = z.infer<ReturnType<typeof getFinanceDetailsSchema>>;
