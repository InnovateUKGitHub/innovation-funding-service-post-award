import { z } from "zod";
import { PartnerStatus } from "@framework/constants";
import { makeZodI18nMap } from "@shared/zodi18n";

export const partnerDetailsEditErrorMap = makeZodI18nMap({ keyPrefix: ["partnerDetailsEdit"] });

export const partnerDetailsEditSchema = z.object({
  "new-postcode": z.string().min(1).max(10),
});

export const emptySchema = z.object({
  "new-postcode": z.string(),
});

export const postcodeSetupSchema = z
  .object({
    "new-postcode": z.string().min(1).max(10),
    partnerStatus: z.nativeEnum(PartnerStatus),
  })
  .refine(
    ({ "new-postcode": postcode, partnerStatus }) =>
      partnerStatus !== PartnerStatus.Active || !postcode || postcode?.length < 1,
  );
