import { makeZodI18nMap } from "@shared/zodi18n";
import { z } from "zod";

export const monitoringReportSummaryErrorMap = makeZodI18nMap({ keyPrefix: ["monitoringReportSummary"] });

const sectionsWithoutOptionId = ["Summary", "Issues and actions"];

export const monitoringReportSummarySchema = z.discriminatedUnion("button_submit", [
  z.object({
    button_submit: z.literal("submit"),
    questions: z.array(
      z
        .object({
          optionId: z.string(),
          comments: z.string().max(5000),
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
          // need to use super refine to ensure title is in the scope for i18n
          if (data.comments.length < 1) {
            ctx.addIssue({
              code: z.ZodIssueCode.too_small,
              minimum: 1,
              type: "string",
              inclusive: true,
              path: ["comments"],
            });
          }
        }),
    ),
    periodId: z.number(),
    addComments: z.string().max(5000).optional(),
  }),
  z.object({
    button_submit: z.literal("saveAndReturnToSummary"),
    questions: z.array(
      z.object({
        optionId: z.string().optional(),
        comments: z.string().max(5000).optional(),
      }),
    ),
    periodId: z.number(),
    addComments: z.string().max(5000),
  }),
]);
