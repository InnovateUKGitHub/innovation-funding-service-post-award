import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { PartnerStatus } from "@framework/constants/partner";
import { getTextareaValidation } from "@ui/zod/textareaValidator.zod";

export const partnerDetailsEditErrorMap = makeZodI18nMap({ keyPrefix: ["partnerDetailsEdit"] });

export const partnerDetailsEditSchema = z.object({
  postcode: getTextareaValidation({
    label: "forms.partnerDetailsEdit.postcode.label",
    minLength: 1,
    maxLength: 10,
    required: true,
  }),
});

export const partnerDetailsOptionalSchema = z.object({
  postcode: getTextareaValidation({
    label: "forms.partnerDetailsEdit.postcode.label",
    minLength: 1,
    maxLength: 10,
    required: true,
  }),
});

export const postcodeSetupSchema = z
  .object({
    postcode: getTextareaValidation({
      label: "forms.partnerDetailsEdit.postcode.label",
      maxLength: 10,
      required: false,
    }),
    partnerStatus: z.nativeEnum(PartnerStatus),
  })
  .refine(
    ({ postcode: postcode, partnerStatus }) =>
      partnerStatus !== PartnerStatus.Active || !postcode || postcode?.length < 1,
  );
