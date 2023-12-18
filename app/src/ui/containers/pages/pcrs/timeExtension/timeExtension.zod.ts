import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";

export const errorMap = makeZodI18nMap({ keyPrefix: ["pcr", "timeExtension"] });

export const pcrTimeExtensionSchema = z
  .object({
    markedAsComplete: z.boolean(),
    timeExtension: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.timeExtension === "0" && data.markedAsComplete) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["timeExtension"],
      });
    }
  });

export type TimeExtensionSchemaType = z.infer<typeof pcrTimeExtensionSchema>;
