import { makeZodI18nMap } from "@shared/zodi18n";
import { FormTypes } from "@ui/zod/FormTypes";
import { getTextValidation } from "@ui/zod/textareaValidator.zod";
import { z } from "zod";

export const monitoringReportSummaryErrorMap = makeZodI18nMap({ keyPrefix: ["monitoringReportSummary"] });

const sectionsWithoutOptionId = ["Summary", "Issues and actions"];

export const monitoringReportSummarySchema = z.discriminatedUnion("button_submit", [
  z.object({
    button_submit: z.literal("submit"),
    form: z.literal(FormTypes.MonitoringReportSummary),
    questions: z.array(
      z
        .object({
          optionId: z.string(),
          comments: getTextValidation({ required: true, minLength: 1, maxLength: 32000 }),
          title: z.string(),
        })
        .superRefine((data, ctx) => {
          if (data.optionId.length < 1 && !sectionsWithoutOptionId.includes(data.title)) {
            ctx.addIssue({
              code: z.ZodIssueCode.too_small,
              minimum: 1,
              type: "string",
              inclusive: true,
              path: ["optionId"],
            });
          }
        }),
    ),
    periodId: z.number(),
    addComments: getTextValidation({
      maxLength: 5000,
      required: true,
    }),
  }),
  z.object({
    button_submit: z.literal("saveAndReturnToSummary"),
    questions: z.array(
      z.object({
        optionId: z.string().optional(),
        comments: getTextValidation({ required: false, maxLength: 32000 }),
      }),
    ),
    periodId: z.number(),
    addComments: getTextValidation({
      maxLength: 5000,
      required: false,
    }),
  }),
]);
