import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { BankCheckStatus } from "@framework/constants/partner";
import { FormTypes } from "@ui/zod/FormTypes";
import { partnerIdValidation, projectIdValidation } from "@ui/zod/helperValidators.zod";

const projectSetupBankDetailsErrorMap = makeZodI18nMap({ keyPrefix: ["projectSetupBankDetails"] });

const projectSetupBankDetailsMaxLength = 255 as const;

const getProjectSetupBankDetailsSchema = (
  bankVerifiedStatus: BankCheckStatus,
): typeof validatedProjectSetupBankDetailsSchema | typeof unvalidatedProjectSetupBankDetailsSchema =>
  bankVerifiedStatus === BankCheckStatus.ValidationPassed
    ? validatedProjectSetupBankDetailsSchema
    : unvalidatedProjectSetupBankDetailsSchema;

const validatedProjectSetupBankDetailsSchema = z.object({
  projectId: projectIdValidation,
  partnerId: partnerIdValidation,
  form: z.literal(FormTypes.ProjectSetupBankDetails),
  companyNumber: z.string().max(projectSetupBankDetailsMaxLength),
  accountBuilding: z.string().max(projectSetupBankDetailsMaxLength),
  accountStreet: z.string().max(projectSetupBankDetailsMaxLength),
  accountLocality: z.string().max(projectSetupBankDetailsMaxLength),
  accountTownOrCity: z.string().max(projectSetupBankDetailsMaxLength),
  accountPostcode: z.string().max(projectSetupBankDetailsMaxLength),
  bankCheckValidation: z.undefined(),
});

const unvalidatedProjectSetupBankDetailsSchema = z
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
  .merge(validatedProjectSetupBankDetailsSchema);

type ProjectSetupBankDetailsSchemaType = ReturnType<typeof getProjectSetupBankDetailsSchema>;

export {
  projectSetupBankDetailsErrorMap,
  getProjectSetupBankDetailsSchema,
  ProjectSetupBankDetailsSchemaType,
  projectSetupBankDetailsMaxLength,
};
