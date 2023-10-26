import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";

export const claimSummaryErrorMap = makeZodI18nMap({ keyPrefix: ["claimReview"] });

export const claimSummarySchema = z.object({
  status: z.string(),
  comments: z.string().max(1000),
  button_submit: z.string(),
});
