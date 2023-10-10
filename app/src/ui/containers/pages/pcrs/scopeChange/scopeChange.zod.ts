import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";

export const errorMap = makeZodI18nMap({ keyPrefix: ["pcrScopeChange"] });

z.setErrorMap(errorMap);

const maxSize = 32_000;

export const pcrScopeChangeSchema = z
  .object({
    itemStatus: z.coerce.string(),
    projectSummary: z.string().optional(),
    publicDescription: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.itemStatus === "marked-as-complete") {
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

      if ((data?.projectSummary?.length ?? 0) > maxSize) {
        ctx.addIssue({
          type: "string",
          code: z.ZodIssueCode.too_big,
          maximum: maxSize,
          inclusive: true,
          path: ["projectSummary"],
        });
      }

      if ((data?.publicDescription?.length ?? 0) > maxSize) {
        ctx.addIssue({
          type: "string",
          code: z.ZodIssueCode.too_big,
          maximum: maxSize,
          inclusive: true,
          path: ["publicDescription"],
        });
      }
    }
  });
export type PcrScopeChangeSchemaType = z.infer<typeof pcrScopeChangeSchema>;
