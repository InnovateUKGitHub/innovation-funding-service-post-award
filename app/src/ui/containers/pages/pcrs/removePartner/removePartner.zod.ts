import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { emptyStringToNullValidation, partnerIdValidation } from "@ui/zod/helperValidators.zod";

export const errorMap = makeZodI18nMap({ keyPrefix: ["pcr", "removePartner"] });

z.setErrorMap(errorMap);

export const getRemovePartnerSchema = (numberOfPeriods: number) =>
  z
    .object({
      markedAsComplete: z.boolean(),
      removalPeriod: z.coerce.number().int().max(numberOfPeriods).nullable(),
      partnerId: z.union([emptyStringToNullValidation, partnerIdValidation]),
    })
    .superRefine((data, ctx) => {
      if (data.markedAsComplete) {
        if (!data.partnerId) {
          ctx.addIssue({
            code: z.ZodIssueCode.too_small,
            minimum: 1,
            inclusive: true,
            type: "string",
            path: ["partnerId"],
          });
        }

        if (!data.removalPeriod) {
          ctx.addIssue({
            code: z.ZodIssueCode.too_small,
            minimum: 1,
            inclusive: true,
            type: "number",
            path: ["removalPeriod"],
          });
        }
      }
    });

export type RemovePartnerSchemaType = z.infer<ReturnType<typeof getRemovePartnerSchema>>;
