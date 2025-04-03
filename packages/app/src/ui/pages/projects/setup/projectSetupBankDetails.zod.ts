import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { BankCheckStatus } from "@framework/constants/partner";
import { FormTypes } from "@ui/zod/FormTypes";

import { getTextValidation } from "@ui/zod/textareaValidator.zod";

const projectSetupBankDetailsErrorMap = makeZodI18nMap({ keyPrefix: ["projectSetupBankDetails"] });

const projectSetupBankDetailsMaxLength = 255 as const;

const projectSetupBankDetailsValidation = getTextValidation({
  maxLength: projectSetupBankDetailsMaxLength,
  required: false,
});

type UnValidatedSchema = typeof unvalidatedProjectSetupBankDetailsSchema;
type ValidatedSchema = typeof validatedProjectSetupBankDetailsSchema;

const getProjectSetupBankDetailsSchema = (bankCheckStatus: BankCheckStatus): ValidatedSchema | UnValidatedSchema =>
  bankCheckStatus === BankCheckStatus.ValidationPassed
    ? validatedProjectSetupBankDetailsSchema
    : unvalidatedProjectSetupBankDetailsSchema;

const validatedProjectSetupBankDetailsSchema = z.object({
  form: z.literal(FormTypes.ProjectSetupBankDetails),
  companyNumber: projectSetupBankDetailsValidation,
  accountBuilding: projectSetupBankDetailsValidation,
  accountStreet: projectSetupBankDetailsValidation,
  accountLocality: projectSetupBankDetailsValidation,
  accountTownOrCity: projectSetupBankDetailsValidation,
  accountPostcode: projectSetupBankDetailsValidation,
  bankCheckStatus: z.coerce.number().int(),
  bankCheckValidation: z.undefined(),
});

const unvalidatedProjectSetupBankDetailsSchema = z
  .object({
    sortCode: z
      .string()
      .min(1)
      .regex(/^\d\d-?\d\d-?\d\d$/)
      .transform(x => x.replaceAll("-", "")),
    accountNumber: z.string().regex(/^\d+$/).min(6).max(8),
  })
  .merge(validatedProjectSetupBankDetailsSchema);

export type ProjectSetupBankDetailsSchemaType = ReturnType<typeof getProjectSetupBankDetailsSchema>;
export type ProjectSetupBankDetailsSchemaOutput<T extends BankCheckStatus = BankCheckStatus.NotValidated> = T extends
  | BankCheckStatus.NotValidated
  | BankCheckStatus.ValidationPassed
  ? z.output<typeof unvalidatedProjectSetupBankDetailsSchema>
  : z.output<typeof validatedProjectSetupBankDetailsSchema>;

export {
  projectSetupBankDetailsErrorMap,
  getProjectSetupBankDetailsSchema,
  projectSetupBankDetailsMaxLength,
  ValidatedSchema,
  UnValidatedSchema,
};
