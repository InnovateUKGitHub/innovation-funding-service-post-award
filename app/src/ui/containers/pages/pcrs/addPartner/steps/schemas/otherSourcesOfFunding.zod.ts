import { isEmptyDate, isValidMonth, isValidYear } from "@framework/validation-helpers/date";
import { z } from "zod";

const valueDescription = z.object({
  value: z.coerce.number().min(1),
  description: z.string().min(1),
});

/*
 * this approach bypasses the limitation that objects only reach refine after all fields have been otherwise passed
 */
const dateSecured = z
  .object({
    dateSecured_month: z.string().optional().nullable(),
    dateSecured_year: z.string().optional().nullable(),
    dateSecured: z.date().nullable(),
  })
  .superRefine((data, ctx) => {
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
