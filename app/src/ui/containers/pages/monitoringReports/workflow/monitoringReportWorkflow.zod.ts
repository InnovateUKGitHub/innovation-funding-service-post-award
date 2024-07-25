import { makeZodI18nMap } from "@shared/zodi18n";
import { getTextareaValidation } from "@ui/zod/textareaValidator.zod";
import { z } from "zod";

export const monitoringReportWorkflowErrorMap = makeZodI18nMap({ keyPrefix: ["monitoringReportWorkflow"] });

export const monitoringReportWorkflowSchema = z.object({
  button_submit: z.string(),
  questions: z.array(
    z
      .object({
        optionId: z.string(),
        comments: getTextareaValidation({
          maxLength: 32_000,
          required: false,
        }),
        title: z.string(),
      })
      .refine(
        ({ comments, optionId }) => {
          return comments?.length ?? 0 > 0 ? optionId?.length ?? 0 > 0 : true;
        },
        { path: ["optionId"] },
      ),
  ),
});
