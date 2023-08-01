import { makeZodI18nMap } from "@shared/zodi18n";
import { z } from "zod";

export const monitoringReportSummaryErrorMap = makeZodI18nMap({ keyPrefix: ["monitoringReportSummary"] });

export const monitoringReportSummarySchema = z.discriminatedUnion("button_submit", [
  z.object({
    button_submit: z.literal("submit"),
    questions: z.array(
      z.object({
        optionId: z.string().min(1),
        comments: z.string().min(1).max(5000),
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
