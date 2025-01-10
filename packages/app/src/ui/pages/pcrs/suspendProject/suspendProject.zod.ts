import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { endDateIsBeforeStart, isValidMonth, isValidYear, isEmptyDate } from "@framework/validation-helpers/date";
import { FormTypes } from "@ui/zod/FormTypes";

export const pcrProjectSuspensionErrorMap = makeZodI18nMap({ keyPrefix: ["pcr", "projectSuspension"] });

export const projectSuspensionSchema = z
  .object({
    projectStartDate: z.date().nullable(),
    projectEndDate: z.date().nullable(),
    markedAsComplete: z.boolean(),
    suspensionStartDate_month: z.string().optional(),
    suspensionStartDate_year: z.string().optional(),
    suspensionEndDate_month: z.string().optional(),
    suspensionEndDate_year: z.string().optional(),
    form: z.literal(FormTypes.PcrProjectSuspensionStep),

    // these just used to allow the error to have a position in the form type
    suspensionStartDate: z.string(),
    suspensionEndDate: z.string(),
  })
  .superRefine((data, ctx) => {
    const suspensionStartDate =
      typeof data.suspensionStartDate_year === "string" && typeof data.suspensionStartDate_month === "string"
        ? new Date(+data.suspensionStartDate_year, +data.suspensionStartDate_month - 1, 1, 12) // First day of the month, add 12 hours for time zone anomalies
        : null;
    const suspensionEndDate =
      typeof data.suspensionEndDate_year === "string" && typeof data.suspensionEndDate_month === "string"
        ? new Date(+data.suspensionEndDate_year, +data.suspensionEndDate_month, 0, -12) // Last day of the month (-1st day of the next month), remove 12 hours for time zone anomalies
        : null;

    if (data.markedAsComplete) {
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
      } else if (suspensionStartDate && data.projectStartDate && suspensionStartDate < data.projectStartDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          type: "date",
          minimum: data.projectStartDate?.getTime(),
          inclusive: true,
          path: ["suspensionStartDate"],
        });
      } else if (suspensionStartDate && data.projectEndDate && suspensionStartDate > data.projectEndDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_big,
          type: "date",
          maximum: data?.projectEndDate?.getTime(),
          inclusive: true,
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
      } else if (suspensionEndDate && data.projectStartDate && suspensionEndDate < data.projectStartDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          type: "date",
          minimum: data.projectStartDate?.getTime(),
          inclusive: true,
          path: ["suspensionEndDate"],
        });
      } else if (suspensionEndDate && data.projectEndDate && suspensionEndDate > data.projectEndDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_big,
          type: "date",
          maximum: data.projectEndDate?.getTime(),
          inclusive: true,
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
          code: z.ZodIssueCode.invalid_date,
          path: ["suspensionEndDate"],
        });
      }
    }
  });

export type ProjectSuspensionSchema = typeof projectSuspensionSchema;

export type ProjectSuspensionSchemaType = z.infer<ProjectSuspensionSchema>;

export const pcrProjectSuspensionSummarySchema = z
  .object({
    form: z.literal(FormTypes.PcrProjectSuspensionSummary),
    markedAsComplete: z.boolean(),
    suspensionStartDate: z.date().nullable(),
    suspensionEndDate: z.date().nullable(),
  })
  .refine(data => !data.markedAsComplete || data.suspensionStartDate instanceof Date, {
    path: ["suspensionStartDate"],
  });

export type ProjectSuspensionSummarySchema = typeof pcrProjectSuspensionSummarySchema;
export type ProjectSuspensionSummarySchemaType = z.infer<ProjectSuspensionSummarySchema>;
