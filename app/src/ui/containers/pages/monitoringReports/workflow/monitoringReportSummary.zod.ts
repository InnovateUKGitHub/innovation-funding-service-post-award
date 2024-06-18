import { makeZodI18nMap } from "@shared/zodi18n";
import { evaluateObject } from "@ui/zod/helperValidators.zod";
import { getTextValidation } from "@ui/zod/textareaValidator.zod";
import { z } from "zod";

export const monitoringReportSummaryErrorMap = makeZodI18nMap({ keyPrefix: ["monitoringReportSummary"] });

const sectionsWithoutOptionId = ["Summary", "Issues and actions"];

export const monitoringReportSummarySchema = evaluateObject(
  ({ button_submit }: { button_submit: "submit" | "saveAndReturnToSummary" }) => ({
    button_submit: z.union([z.literal("submit"), z.literal("saveAndReturnToSummary")]),
    questions: z.array(
      z
        .object({
          optionId: z.string(),
          comments: getTextValidation({ required: button_submit === "submit", minLength: 1, maxLength: 32000 }),
          title: z.string(),
        })
        .superRefine((data, ctx) => {
          if (button_submit === "submit") {
            if (data.optionId.length < 1 && !sectionsWithoutOptionId.includes(data.title)) {
              ctx.addIssue({
                code: z.ZodIssueCode.too_small,
                minimum: 1,
                type: "string",
                inclusive: true,
                path: ["optionId"],
              });
            }
          }
        }),
    ),
    periodId: z.number(),
    addComments: getTextValidation({
      maxLength: 5000,
      required: button_submit === "submit",
    }),
  }),
);
