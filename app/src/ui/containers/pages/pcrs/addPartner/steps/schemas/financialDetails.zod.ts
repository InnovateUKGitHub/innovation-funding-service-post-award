import { isEmptyDate, isValidMonth, isValidYear } from "@framework/validation-helpers/date";
import { getGenericCurrencyValidation } from "@ui/zod/currencyValidator.zod";
import { FormTypes } from "@ui/zod/FormTypes";
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
    if (!/^\d*$/.test(data.financialYearEndDate_month) || !/^\d*$/.test(data.financialYearEndDate_year)) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_type,
        received: "string",
        expected: "number",
        path: ["financialYearEndDate"],
      });
    }

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
    financialYearEndDate_month: z.string(),
    financialYearEndDate_year: z.string(),
  })
  .superRefine((data, ctx) => {
    if (!/^\d*$/.test(data.financialYearEndDate_month) || !/^\d*$/.test(data.financialYearEndDate_year)) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_type,
        received: "string",
        expected: "number",
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

export const getFinanceDetailsSchema = (markedAsComplete: boolean) =>
  markedAsComplete
    ? z
        .object({
          markedAsComplete: z.string(),
          form: z.literal(FormTypes.PcrAddPartnerFinancialDetailsStep),
          button_submit: z.string(),
          financialYearEndTurnover: getGenericCurrencyValidation({
            label: "forms.pcr.addPartner.financialYearEndTurnover.label",
            required: true,
          }),
        })
        .and(dateSecuredRequired)
    : z
        .object({
          markedAsComplete: z.string(),
          form: z.literal(FormTypes.PcrAddPartnerFinancialDetailsStep),
          button_submit: z.string(),
          financialYearEndTurnover: getGenericCurrencyValidation({
            label: "forms.pcr.addPartner.financialYearEndTurnover.label",
          }),
        })
        .and(dateSecuredOptional);

export type FinanceDetailsSchemaType = ReturnType<typeof getFinanceDetailsSchema>;
export type FinanceDetailsSchema = z.infer<FinanceDetailsSchemaType>;
