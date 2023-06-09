import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";

export const projectSetupBankDetailsErrorMap = makeZodI18nMap({ keyPrefix: ["projectSetupBankDetails"] });

export const projectSetupBankDetailsSchema = z.object({
  // companyNumber: z.string().min(1).max(10),
  sortCode: z.string().regex(/\d{6}|\d\d-\d\d-\d\d/),
  accountNumber: z.string().min(6).max(8).regex(/^\d+$/),
  // accountBuilding: z.string().min(1).max(10),
  // accountStreet: z.string().min(1).max(10),
  // accountLocality: z.string().min(1).max(10),
  // accountTownOrCity: z.string().min(1).max(10),
  // accountPostcode: z.string().min(1).max(10),
});
