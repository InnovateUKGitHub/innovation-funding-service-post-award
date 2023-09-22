import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { BankCheckStatus } from "@framework/constants/partner";

export const projectSetupBankDetailsErrorMap = makeZodI18nMap({ keyPrefix: ["projectSetupBankDetails"] });

export const getProjectSetupBankDetailsSchema = (bankVerifiedStatus: BankCheckStatus) =>
  bankVerifiedStatus === BankCheckStatus.ValidationPassed
    ? verifiedProjectSetupBankDetailsSchema
    : projectSetupBankDetailsSchema;

const projectSetupBankDetailsSchema = z.object({
  sortCode: z
    .string()
    .min(1)
    .regex(/^\d\d-?\d\d-?\d\d$/),
  accountNumber: z
    .string()
    .min(1)
    .regex(/^\d{6,8}$/),
  companyNumber: z.string(),
  accountBuilding: z.string(),
  accountStreet: z.string(),
  accountLocality: z.string(),
  accountTownOrCity: z.string(),
  accountPostcode: z.string(),
});

const verifiedProjectSetupBankDetailsSchema = z.object({
  companyNumber: z.string(),
  accountBuilding: z.string(),
  accountStreet: z.string(),
  accountLocality: z.string(),
  accountTownOrCity: z.string(),
  accountPostcode: z.string(),
});
