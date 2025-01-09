import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import {
  emptyStringToNullValidation,
  evaluateObject,
  partnerIdValidation,
} from "@ui/zod/helperValidators/helperValidators.zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { getTextValidation } from "@ui/zod/textareaValidator.zod";

export const renamePartnerErrorMap = makeZodI18nMap({ keyPrefix: ["pcr", "renamePartner"] });

export const renamePartnerSchema = evaluateObject((data: { markedAsComplete: boolean }) => ({
  markedAsComplete: z.boolean(),
  accountName: getTextValidation({
    maxLength: 256,
    required: data.markedAsComplete,
  }),
  existingAccountName: getTextValidation({
    maxLength: 256,
    required: data.markedAsComplete,
  }),
  partnerId: data.markedAsComplete ? partnerIdValidation : z.union([emptyStringToNullValidation, partnerIdValidation]),
  form: z.union([z.literal(FormTypes.PcrRenamePartnerSummary), z.literal(FormTypes.PcrRenamePartnerStep)]),
})).superRefine((data, ctx) => {
  if (data.partnerId) {
    if (data.existingAccountName === data.accountName) {
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

export type RenamePartnerSchema = typeof renamePartnerSchema;

export type RenamePartnerSchemaType = z.infer<RenamePartnerSchema>;
