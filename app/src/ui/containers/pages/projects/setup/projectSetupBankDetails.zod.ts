import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";

export const projectSetupBankDetailsErrorMap = makeZodI18nMap({ keyPrefix: ["projectSetupBankDetails"] });

export const projectSetupBankDetailsSchema = z
  .object({
    sortCode: z
      .string()
      .min(1)
      .regex(/^\d\d-?\d\d-?\d\d$/),
    accountNumber: z
      .string()
      .min(1)
      .regex(/^\d{6,8}$/),
  })
  .required();
