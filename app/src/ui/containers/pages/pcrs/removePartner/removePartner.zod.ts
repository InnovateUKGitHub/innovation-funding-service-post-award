import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { emptyStringToNullValidation, partnerIdValidation } from "@ui/zod/helperValidators.zod";
import { isNil } from "lodash";

export const errorMap = makeZodI18nMap({ keyPrefix: ["pcr", "removePartner"] });

export const getRemovePartnerSchema = (numberOfPeriods: number) =>
  z
    .object({
      markedAsComplete: z.boolean(),
      removalPeriod: z.coerce.number().int().min(1).max(numberOfPeriods).nullable(),
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

        if (isNil(data?.removalPeriod)) {
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
