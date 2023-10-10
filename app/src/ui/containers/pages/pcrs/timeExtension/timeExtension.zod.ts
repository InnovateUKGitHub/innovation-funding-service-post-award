import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";

export const errorMap = makeZodI18nMap({ keyPrefix: ["pcrTimeExtension"] });

z.setErrorMap(errorMap);

export const pcrTimeExtensionSchema = z
  .object({
    itemStatus: z.coerce.string(),
    timeExtension: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.timeExtension === "0" && data.itemStatus === "marked-as-complete") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["timeExtension"],
      });
    }
  });
