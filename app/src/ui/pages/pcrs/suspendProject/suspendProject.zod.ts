import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { endDateIsBeforeStart, isValidMonth, isValidYear, isEmptyDate } from "@framework/validation-helpers/date";
import { FormTypes } from "@ui/zod/FormTypes";

export const pcrProjectSuspensionErrorMap = makeZodI18nMap({ keyPrefix: ["pcr", "projectSuspension"] });

export const getProjectSuspensionSchema = ({ startDate, endDate }: { startDate: Date | null; endDate: Date | null }) =>
  z
    .object({
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
          ? new Date(+data.suspensionStartDate_year, +data.suspensionStartDate_month - 1, undefined, 12) // First day of the month, add 12 hours for time zone anomalies
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

      if (!isEmptyDate(data.suspensionStartDate_month, data.suspensionStartDate_year)) {
        if (suspensionStartDate && startDate && suspensionStartDate < startDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.too_small,
            type: "date",
            minimum: startDate?.getTime(),
            inclusive: true,
            path: ["suspensionStartDate"],
          });
        } else if (suspensionStartDate && endDate && suspensionStartDate > endDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.too_big,
            type: "date",
            maximum: endDate?.getTime(),
            inclusive: true,
            path: ["suspensionStartDate"],
          });
        } else if (!isValidMonth(data.suspensionStartDate_month) || !isValidYear(data.suspensionStartDate_year)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["suspensionStartDate"],
          });
        }
      }

      if (!isEmptyDate(data.suspensionEndDate_month, data.suspensionEndDate_year)) {
        if (suspensionEndDate && startDate && suspensionEndDate < startDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.too_small,
            type: "date",
            minimum: startDate?.getTime(),
            inclusive: true,
            path: ["suspensionEndDate"],
          });
        } else if (suspensionEndDate && endDate && suspensionEndDate > endDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.too_big,
            type: "date",
            maximum: endDate?.getTime(),
            inclusive: true,
            path: ["suspensionEndDate"],
          });
        } else if (!isValidMonth(data.suspensionEndDate_month) || !isValidYear(data.suspensionEndDate_year)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["suspensionEndDate"],
          });
        }
      }
    });

export type ProjectSuspensionSchema = ReturnType<typeof getProjectSuspensionSchema>;

export type ProjectSuspensionSchemaType = z.infer<ProjectSuspensionSchema>;

export const pcrProjectSuspensionSummarySchema = z
  .object({
    form: z.literal(FormTypes.PcrProjectSuspensionSummary),
    markedAsComplete: z.boolean(),
    suspensionStartDate: z.date().nullable(),
  })
  .refine(data => !data.markedAsComplete || data.suspensionStartDate instanceof Date, {
    path: ["suspensionStartDate"],
  });

export type ProjectSuspensionSummarySchema = typeof pcrProjectSuspensionSummarySchema;
export type ProjectSuspensionSummarySchemaType = z.infer<ProjectSuspensionSummarySchema>;
