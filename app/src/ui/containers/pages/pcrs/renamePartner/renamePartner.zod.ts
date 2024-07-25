import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { PartnerDto } from "@framework/dtos/partnerDto";
import {
  emptyStringToNullValidation,
  evaluateObject,
  partnerIdValidation,
  pcrIdValidation,
  pcrItemIdValidation,
  projectIdValidation,
} from "@ui/zod/helperValidators.zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { getTextareaValidation } from "@ui/zod/textareaValidator.zod";

export const renamePartnerErrorMap = makeZodI18nMap({ keyPrefix: ["pcr", "renamePartner"] });

export const getRenamePartnerSchema = (partners: Pick<PartnerDto, "id" | "name">[]) =>
  evaluateObject(data => ({
    markedAsComplete: z.boolean(),
    accountName: getTextareaValidation({
      maxLength: 256,
      required: data.markedAsComplete,
    }),
    partnerId: z.union([emptyStringToNullValidation, partnerIdValidation]),
    form: z.union([z.literal(FormTypes.PcrRenamePartnerSummary), z.literal(FormTypes.PcrRenamePartnerStep)]),
    projectId: projectIdValidation,
    pcrId: pcrIdValidation,
    pcrItemId: pcrItemIdValidation,
  })).superRefine((data, ctx) => {
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
      if (!data.partnerId) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: 1,
          inclusive: true,
          type: "string",
          path: ["partnerId"],
        });
      }
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

export type RenamePartnerSchema = ReturnType<typeof getRenamePartnerSchema>;

export type RenamePartnerSchemaType = z.infer<RenamePartnerSchema>;
