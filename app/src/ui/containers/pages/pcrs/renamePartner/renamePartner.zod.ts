import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { partnerIdValidation } from "@ui/zod/helperValidators.zod";

export const errorMap = makeZodI18nMap({ keyPrefix: ["pcrRenamePartner"] });

z.setErrorMap(errorMap);

export const getRenamePartnerSchema = (partners: Pick<PartnerDto, "id" | "name">[]) =>
  z
    .object({
      markedAsComplete: z.boolean(),
      accountName: z.string().optional(),
      partnerId: partnerIdValidation,
    })
    .superRefine((data, ctx) => {
      if (data.partnerId) {
        const matchingName = partners.find(x => x.id === data.partnerId)?.name;
        if (matchingName === data.accountName) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["accountName"],
          });
        }
      }
      if (data.markedAsComplete) {
        if (!data.accountName) {
          ctx.addIssue({
            code: z.ZodIssueCode.too_small,
            minimum: 1,
            inclusive: true,
            type: "string",
            path: ["accountName"],
          });
        }
      }
    });

export type RenamePartnerSchemaType = z.infer<ReturnType<typeof getRenamePartnerSchema>>;
