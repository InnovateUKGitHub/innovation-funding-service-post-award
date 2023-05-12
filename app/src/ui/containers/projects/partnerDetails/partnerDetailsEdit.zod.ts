import { z } from "zod";
import { PartnerStatus } from "@framework/constants";

const message = "You must provide your project location postcode";

export const partnerDetailsEditSchema = z.object({
  postcode: z.string().min(1, message),
});

export const emptySchema = z.object({
  postcode: z.string(),
});

export const postcodeSetupSchema = z
  .object({
    postcode: z.string().min(1, message),
    partnerStatus: z.nativeEnum(PartnerStatus),
  })
  .refine(
    ({ postcode, partnerStatus }) => partnerStatus !== PartnerStatus.Active || !postcode || postcode?.length < 1,
    {
      message,
    },
  );
