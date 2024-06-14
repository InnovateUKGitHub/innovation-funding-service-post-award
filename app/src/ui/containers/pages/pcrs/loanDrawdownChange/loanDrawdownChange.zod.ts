import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { isNil, sumBy } from "lodash";
import { combineDayMonthYear, validateDayMonthYear } from "@ui/components/atomicDesign/atoms/Date";
import { getGenericCurrencyValidation } from "@ui/zod/currencyValidator.zod";
import { parseCurrency } from "@framework/util/numberHelper";

export const errorMap = makeZodI18nMap({ keyPrefix: ["pcr", "loanDrawdownChange"] });

export const loanDrawdownChangeSchema = z
  .object({
    markedAsComplete: z.boolean(),
    loans: z.array(
      z.object({
        period: z.number(),
        currentDate: z.date(),
        currentValue: z.number(),
        newDate: z.date().optional().nullable(),
        newDate_day: z.string().regex(/^\d\d?$/),
        newDate_month: z.string().regex(/^\d\d?$/),
        newDate_year: z.string().regex(/^\d\d\d\d$/),
        newValue: getGenericCurrencyValidation({
          label: "forms.pcr.loanDrawdownChange.loans.arrayType.newValue.label",
          min: -1_000_000_000,
        }),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    const currentTotal = sumBy(data.loans, x => x.currentValue);
    const newTotal = sumBy(data.loans, x => (isNil(x.newValue) ? 0 : parseCurrency(x.newValue)));

    if (newTotal > currentTotal) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        maximum: currentTotal,
        type: "number",
        inclusive: true,
        path: ["newValue"],
      });
    }

    data.loans.forEach((loan, i, arr) => {
      if (!validateDayMonthYear(loan.newDate_day, loan.newDate_month, loan.newDate_year)) {
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_date,
          path: ["loans", i, "newDate"],
        });
      }

      if (i === 0) return;

      const lastLoan = arr[i - 1];

      const lastNewDate = combineDayMonthYear(lastLoan.newDate_day, lastLoan.newDate_month, lastLoan.newDate_year);
      const currentNewDate = combineDayMonthYear(loan.newDate_day, loan.newDate_month, loan.newDate_year);

      const dateIsOutOfOrder = currentNewDate && lastNewDate && currentNewDate < lastNewDate;

      if (dateIsOutOfOrder) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: {
            periodA: loan.period,
            periodB: lastLoan.period,
            i18n: "errors.date_out_of_order",
          },
          path: ["loans", i, "newDate"],
        });
      }
    });
  });

export const loanDrawdownChangeSummarySchema = z
  .object({
    markedAsComplete: z.boolean(),
    loans: z.array(
      z.object({
        period: z.number(),
        currentDate: z.date(),
        currentValue: z.number(),
        newDate: z.date(),
        newValue: z.number(),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    if (data.markedAsComplete) {
      // check new amount does not exceed current amount

      const currentTotal = sumBy(data.loans, x => x.currentValue);
      const newTotal = sumBy(data.loans, x => x.newValue);

      if (newTotal > currentTotal) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_big,
          maximum: currentTotal,
          type: "number",
          inclusive: true,
          path: ["newValue"],
        });
      }

      data.loans.forEach((loan, i, arr) => {
        const lastLoan = arr[i - 1];
        if (i > 0 && loan.newDate < lastLoan.newDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            params: {
              periodA: loan.period,
              periodB: lastLoan.period,
              i18n: "errors.date_out_of_order",
            },
            path: ["loans", i, "newDate"],
          });
        }
      });
    }
  });

export type LoanDrawdownChangeSchema = z.infer<typeof loanDrawdownChangeSchema>;
export type LoanDrawdownChangeSummarySchema = z.infer<typeof loanDrawdownChangeSummarySchema>;
