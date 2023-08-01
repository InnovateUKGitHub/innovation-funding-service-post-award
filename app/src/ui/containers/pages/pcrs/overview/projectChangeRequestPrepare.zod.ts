import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";

export const pcrPrepareErrorMap = makeZodI18nMap({ keyPrefix: ["pcrPrepare"] });

export const pcrPrepareSchema = z.discriminatedUnion("button_submit", [
  z.object({
    button_submit: z.literal("submit"),
    items: z
      .object({
        status: z.string(),
        shortName: z.string(),
      })
      // refine here rather than simply use z.enum in order to make sure the data gets passed through to i18n
      .refine(({ status }) => status === "Complete")
      .array(),
    reasoningStatus: z.enum(["Complete"]),
    comments: z.string().max(1000).optional(),
  }),
  z.object({
    button_submit: z.literal("save-and-return"),
    items: z
      .object({
        status: z.string().optional(),
        shortName: z.string().optional(),
      })
      .array(),
    reasoningStatus: z.string().optional(),
    comments: z.string().max(1000).optional(),
  }),
]);
