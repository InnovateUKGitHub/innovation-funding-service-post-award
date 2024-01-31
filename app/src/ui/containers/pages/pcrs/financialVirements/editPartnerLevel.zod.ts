import { makeZodI18nMap } from "@shared/zodi18n";
import { partnerIdValidation } from "@ui/zod/helperValidators.zod";
import { z } from "zod";

export const errorMap = makeZodI18nMap({ keyPrefix: ["pcr", "editPartnerLevel"] });

export const editPartnerLevelSchema = z
  .object({
    virements: z.array(
      z
        .object({
          newRemainingGrant: z.string().regex(/^£?\d{1,16}(\.\d{1,2})?$/),
          newRemainingCosts: z.number(),
          partnerId: partnerIdValidation,
        })
        .superRefine((data, ctx) => {
          if (Number(data.newRemainingGrant.replace("£", "")) > data.newRemainingCosts) {
            ctx.addIssue({
              code: z.ZodIssueCode.too_big,
              type: "number",
              inclusive: true,
              maximum: data.newRemainingCosts,
              path: ["newRemainingGrant"],
            });
          }
        }),
    ),
    originalRemainingGrant: z.number(),
    newRemainingGrant: z.number(),
    newRemainingCosts: z.number(),
  })
  .superRefine((data, ctx) => {
    if (data.newRemainingGrant > data.newRemainingCosts) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        type: "number",
        inclusive: true,
        maximum: data.newRemainingCosts,
        path: ["newRemainingGrant"],
      });
    }
  });

export type EditPartnerLevelSchema = z.infer<typeof editPartnerLevelSchema>;
