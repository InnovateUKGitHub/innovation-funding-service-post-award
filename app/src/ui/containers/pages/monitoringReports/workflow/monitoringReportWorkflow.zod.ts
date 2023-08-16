import { makeZodI18nMap } from "@shared/zodi18n";
import { z } from "zod";

export const monitoringReportWorkflowErrorMap = makeZodI18nMap({ keyPrefix: ["monitoringReportWorkflow"] });

export const monitoringReportWorkflowSchema = z.object({
  button_submit: z.string(),
  questions: z.array(
    z
      .object({
        optionId: z.string(),
        comments: z.string().max(5000),
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
