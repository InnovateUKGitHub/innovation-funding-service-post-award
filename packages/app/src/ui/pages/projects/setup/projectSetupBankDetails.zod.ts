import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { BankCheckStatus } from "@framework/constants/partner";
import { FormTypes } from "@ui/zod/FormTypes";
import { partnerIdValidation, projectIdValidation } from "@ui/zod/helperValidators/helperValidators.zod";
import { getTextValidation } from "@ui/zod/textareaValidator.zod";

const projectSetupBankDetailsErrorMap = makeZodI18nMap({ keyPrefix: ["projectSetupBankDetails"] });

const projectSetupBankDetailsMaxLength = 255 as const;

const projectSetupBankDetailsValidation = getTextValidation({
  maxLength: projectSetupBankDetailsMaxLength,
  required: false,
});

const getProjectSetupBankDetailsSchema = (
  bankVerifiedStatus: BankCheckStatus,
): typeof validatedProjectSetupBankDetailsSchema | typeof unvalidatedProjectSetupBankDetailsSchema =>
  bankVerifiedStatus === BankCheckStatus.ValidationPassed
    ? validatedProjectSetupBankDetailsSchema
    : unvalidatedProjectSetupBankDetailsSchema;

const validatedProjectSetupBankDetailsSchema = z.object({
  projectId: projectIdValidation,
  partnerId: partnerIdValidation,
  form: z.union([z.literal(FormTypes.ProjectSetupBankDetails), z.literal(FormTypes.ProjectSetupBankDetailsVerify)]),
  companyNumber: projectSetupBankDetailsValidation,
  accountBuilding: projectSetupBankDetailsValidation,
  accountStreet: projectSetupBankDetailsValidation,
  accountLocality: projectSetupBankDetailsValidation,
  accountTownOrCity: projectSetupBankDetailsValidation,
  accountPostcode: projectSetupBankDetailsValidation,
  bankCheckValidation: z.undefined(),
});

const unvalidatedProjectSetupBankDetailsSchema = z
  .object({
    sortCode: z
      .string()
      .min(1)
      .regex(/^\d\d-?\d\d-?\d\d$/)
      .transform(x => x.replaceAll("-", "")),
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
