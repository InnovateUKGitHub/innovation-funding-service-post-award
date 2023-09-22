import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { PartnerStatus } from "@framework/constants/partner";

export const partnerDetailsEditErrorMap = makeZodI18nMap({ keyPrefix: ["partnerDetailsEdit"] });

export const partnerDetailsEditSchema = z.object({
  postcode: z.string().min(1).max(10),
});

export const emptySchema = z.object({
  postcode: z.string(),
});

export const postcodeSetupSchema = z
  .object({
    postcode: z.string().min(1).max(10),
    partnerStatus: z.nativeEnum(PartnerStatus),
  })
  .refine(
    ({ postcode: postcode, partnerStatus }) =>
      partnerStatus !== PartnerStatus.Active || !postcode || postcode?.length < 1,
  );
