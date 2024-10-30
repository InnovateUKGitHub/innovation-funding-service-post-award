import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { FormTypes } from "@ui/zod/FormTypes";

export const errorMap = makeZodI18nMap({ keyPrefix: ["pcr", "timeExtension"] });

export const pcrTimeExtensionSchema = z
  .object({
    form: z.union([z.literal(FormTypes.PcrChangeDurationSummary), z.literal(FormTypes.PcrChangeDurationStep)]),
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

export type TimeExtensionSchema = typeof pcrTimeExtensionSchema;
export type TimeExtensionSchemaType = z.infer<TimeExtensionSchema>;
