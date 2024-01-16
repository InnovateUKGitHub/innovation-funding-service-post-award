import { isEmptyDate, isValidMonth, isValidYear } from "@framework/validation-helpers/date";
import { z } from "zod";

const valueDescription = z.object({
  value: z.coerce.number().min(1),
  description: z.string().min(1),
  id: z.string(),
});

/*
 * this approach bypasses the limitation that objects only reach refine after all fields have been otherwise passed
 */
const dateSecured = z
  .object({
    dateSecured_month: z.string(),
    dateSecured_year: z.string(),
    dateSecured: z.date().nullable(),
  })
  .superRefine((data, ctx) => {
    if (!/^\d*$/.test(data.dateSecured_month) || !/^\d*$/.test(data.dateSecured_year)) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_type,
        received: "string",
        expected: "number",
        path: ["dateSecured"],
      });
    }
    if (isEmptyDate(data.dateSecured_month, data.dateSecured_year)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dateSecured"],
      });
    }

    if (!isValidMonth(data.dateSecured_month) || !isValidYear(data.dateSecured_year)) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_date,
        path: ["dateSecured"],
      });
    }
  });

export const fundingSchema = z.object({
  funds: z.array(valueDescription.and(dateSecured)),
});

const baseSchema = z.object({
  button_submit: z.string(),
  itemsLength: z.string(),
});

export const otherSourcesOfFundingSchema = baseSchema.and(fundingSchema);

export type OtherSourcesOfFundingSchema = z.infer<typeof otherSourcesOfFundingSchema>;
