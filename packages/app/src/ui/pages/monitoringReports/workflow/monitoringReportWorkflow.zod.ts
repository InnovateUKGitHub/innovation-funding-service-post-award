import { makeZodI18nMap } from "@shared/zodi18n";
import { FormTypes } from "@ui/zod/FormTypes";
import { getTextValidation } from "@ui/zod/textareaValidator.zod";
import { z } from "zod";

export const monitoringReportWorkflowErrorMap = makeZodI18nMap({ keyPrefix: ["monitoringReportWorkflow"] });

export const monitoringReportWorkflowSchema = z.object({
  button_submit: z.string(),
  form: z.literal(FormTypes.MonitoringReportQuestion),
  questions: z.array(
    z
      .object({
        optionId: z.string().nullable(),
        comments: getTextValidation({
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

export type MonitoringReportWorkflowSchema = typeof monitoringReportWorkflowSchema;
