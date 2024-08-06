import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { PartnerStatus, PostcodeTaskStatus } from "@framework/constants/partner";
import { getTextValidation } from "@ui/zod/textareaValidator.zod";
import { evaluateObject } from "@ui/zod/helperValidators.zod";
import { FormTypes } from "@ui/zod/FormTypes";

export const partnerDetailsEditErrorMap = makeZodI18nMap({ keyPrefix: ["partnerDetailsEdit"] });

export const partnerDetailsEditSchema = evaluateObject((data: { postcodeStatus: PostcodeTaskStatus }) => ({
  postcodeStatus: z.nativeEnum(PostcodeTaskStatus),
  postcode: getTextValidation({
    minLength: 1,
    maxLength: 10,
    required: data.postcodeStatus === PostcodeTaskStatus.ToDo,
  }),
  partnerStatus: z.nativeEnum(PartnerStatus),
  form: z.literal(FormTypes.PartnerDetailsEdit),
}));

export type PartnerDetailsEditSchema = typeof partnerDetailsEditSchema;

export const postcodeSetupSchema = z
  .object({
    postcode: getTextValidation({
      minLength: 1,
      maxLength: 10,
      required: true,
    }),
    partnerStatus: z.nativeEnum(PartnerStatus),
    postcodeStatus: z.nativeEnum(PostcodeTaskStatus),
    form: z.literal(FormTypes.PartnerDetailsSetup),
  })
  .refine(
    ({ postcode: postcode, partnerStatus }) =>
      partnerStatus !== PartnerStatus.Active || !postcode || postcode?.length < 1,
  );

export type PostcodeSetupSchema = typeof postcodeSetupSchema;
