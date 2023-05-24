import { z } from "zod";
import { PartnerStatus } from "@framework/constants";

const message = "You must provide your project location postcode";

export const partnerDetailsEditSchema = z.object({
  "new-postcode": z.string().min(1, message),
});

export const emptySchema = z.object({
  "new-postcode": z.string(),
});

export const postcodeSetupSchema = z
  .object({
    "new-postcode": z.string().min(1, message),
    partnerStatus: z.nativeEnum(PartnerStatus),
  })
  .refine(
    ({ "new-postcode": postcode, partnerStatus }) =>
      partnerStatus !== PartnerStatus.Active || !postcode || postcode?.length < 1,
    {
      message,
    },
  );
