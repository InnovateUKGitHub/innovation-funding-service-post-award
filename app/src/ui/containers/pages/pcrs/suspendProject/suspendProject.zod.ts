import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { endDateIsBeforeStart, isValidMonth, isValidYear, isEmptyDate } from "@framework/validation-helpers/date";

export const errorMap = makeZodI18nMap({ keyPrefix: ["pcr", "projectSuspension"] });

export const pcrProjectSuspensionSchema = z
  .object({
    markedAsCompleteHasBeenChecked: z.boolean(),
    suspensionStartDate_month: z.string().optional(),
    suspensionStartDate_year: z.string().optional(),
    suspensionEndDate_month: z.string().optional(),
    suspensionEndDate_year: z.string().optional(),

    // these just used to allow the error to have a position in the form type
    suspensionStartDate: z.string(),
    suspensionEndDate: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.markedAsCompleteHasBeenChecked) {
      if (isEmptyDate(data.suspensionStartDate_month, data.suspensionStartDate_year)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["suspensionStartDate"],
        });
      }
    }
    if (!isEmptyDate(data.suspensionStartDate_month, data.suspensionStartDate_year)) {
      if (!isValidMonth(data.suspensionStartDate_month) || !isValidYear(data.suspensionStartDate_year)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["suspensionStartDate"],
        });
      }
    }

    if (!isEmptyDate(data.suspensionEndDate_month, data.suspensionEndDate_year)) {
      if (!isValidMonth(data.suspensionEndDate_month) || !isValidYear(data.suspensionEndDate_year)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["suspensionEndDate"],
        });
      }
    }

    if (
      !isEmptyDate(data.suspensionStartDate_month, data.suspensionStartDate_year) &&
      !isEmptyDate(data.suspensionEndDate_month, data.suspensionEndDate_year)
    ) {
      if (
        endDateIsBeforeStart(
          data.suspensionStartDate_month,
          data.suspensionStartDate_year,
          data.suspensionEndDate_month,
          data.suspensionEndDate_year,
        )
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          type: "date",
          minimum: 0,
          inclusive: true,
          path: ["suspensionEndDate"],
        });
      }
    }
  });

export type ProjectSuspensionSchemaType = z.infer<typeof pcrProjectSuspensionSchema>;

export const pcrProjectSuspensionSummarySchema = z
  .object({
    markedAsComplete: z.boolean(),
    suspensionStartDate: z.date().nullable(),
  })
  .refine(data => !data.markedAsComplete || data.suspensionStartDate instanceof Date, {
    path: ["suspensionStartDate"],
  });

export type ProjectSuspensionSummarySchemaType = z.infer<typeof pcrProjectSuspensionSummarySchema>;
