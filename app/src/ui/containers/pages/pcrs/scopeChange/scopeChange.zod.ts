import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";

export const errorMap = makeZodI18nMap({ keyPrefix: ["pcrScopeChange"] });

z.setErrorMap(errorMap);

export const pcrScopeChangeSchema = z
  .object({
    markedAsComplete: z.boolean(),
    projectSummary: z.string().max(32_000).optional(),
    publicDescription: z.string().max(32_000).optional(),
  })
  .superRefine((data, ctx) => {
    if (!!data.markedAsComplete) {
      if (!data.projectSummary) {
        ctx.addIssue({
          type: "string",
          code: z.ZodIssueCode.too_small,
          minimum: 1,
          inclusive: true,
          path: ["projectSummary"],
        });
      }

      if (!data.publicDescription) {
        ctx.addIssue({
          type: "string",
          code: z.ZodIssueCode.too_small,
          minimum: 1,
          inclusive: true,
          path: ["publicDescription"],
        });
      }
    }
  });

export const pcrScopeChangeProjectSummarySchema = z.object({
  projectSummary: z.string().max(32_000),
});

export const pcrScopeChangePublicDescriptionSchema = z.object({
  publicDescription: z.string().max(32_000),
});

export type PcrScopeChangeSchemaType = z.infer<typeof pcrScopeChangeSchema>;
