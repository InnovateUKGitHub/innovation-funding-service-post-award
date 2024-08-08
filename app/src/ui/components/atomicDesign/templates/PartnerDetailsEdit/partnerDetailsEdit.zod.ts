import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { PartnerStatus } from "@framework/constants/partner";
import { getTextValidation } from "@ui/zod/textareaValidator.zod";

export const partnerDetailsEditErrorMap = makeZodI18nMap({ keyPrefix: ["partnerDetailsEdit"] });

export const partnerDetailsEditSchema = z.object({
  postcode: getTextValidation({
    minLength: 1,
    maxLength: 10,
    required: true,
  }),
});

export const partnerDetailsOptionalSchema = z.object({
  postcode: getTextValidation({
    maxLength: 10,
    required: false,
  }),
});

export const postcodeSetupSchema = z
  .object({
    postcode: getTextValidation({
      minLength: 1,
      maxLength: 10,
      required: true,
    }),
    partnerStatus: z.nativeEnum(PartnerStatus),
  })
  .refine(
    ({ postcode: postcode, partnerStatus }) =>
      partnerStatus !== PartnerStatus.Active || !postcode || postcode?.length < 1,
  );
