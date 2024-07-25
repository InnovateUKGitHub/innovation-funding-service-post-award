import { makeZodI18nMap } from "@shared/zodi18n";
import { FormTypes } from "@ui/zod/FormTypes";
import { pcrIdValidation, pcrItemIdValidation, projectIdValidation } from "@ui/zod/helperValidators.zod";
import { getTextareaValidation } from "@ui/zod/textareaValidator.zod";
import { z } from "zod";

const pcrAddPartnerCompaniesHouseStepSearchMaxLength = 159;
const pcrAddPartnerCompaniesHouseStepOrganisationNameMaxLength = 100;
const pcrAddPartnerCompaniesHouseStepRegistrationNumberMaxLength = 40;
const pcrAddPartnerCompaniesHouseStepRegisteredAddressMaxLength = 32768;

const pcrAddPartnerCompaniesHouseStepErrorMap = makeZodI18nMap({ keyPrefix: ["pcr", "addPartner"] });

const pcrAddPartnerCompaniesHouseStepSearchSchema = z.object({
  step: z.number(),
  search: getTextareaValidation({
    maxLength: pcrAddPartnerCompaniesHouseStepSearchMaxLength,
    required: false,
  }),
});

const pcrAddPartnerCompaniesHouseStepSearchSelectSchema = z.object({
  title: z.string().min(1).max(pcrAddPartnerCompaniesHouseStepOrganisationNameMaxLength),
  registrationNumber: z.string().min(1).max(pcrAddPartnerCompaniesHouseStepRegistrationNumberMaxLength),
  addressFull: z.string().min(1).max(2000), // HTML GET params are very restrictive.
});

const getPcrAddPartnerCompaniesHouseStepSchema = (markedAsComplete: boolean) =>
  z.object({
    form: z.union([
      z.literal(FormTypes.PcrAddPartnerCompaniesHouseStepSaveAndContinue),
      z.literal(FormTypes.PcrAddPartnerCompaniesHouseStepSaveAndQuit),
    ]),
    projectId: projectIdValidation,
    pcrId: pcrIdValidation,
    pcrItemId: pcrItemIdValidation,
    organisationName: getTextareaValidation({
      maxLength: pcrAddPartnerCompaniesHouseStepOrganisationNameMaxLength,
      required: markedAsComplete,
    }),
    registrationNumber: getTextareaValidation({
      maxLength: pcrAddPartnerCompaniesHouseStepRegistrationNumberMaxLength,
      required: markedAsComplete,
    }),
    registeredAddress: getTextareaValidation({
      maxLength: pcrAddPartnerCompaniesHouseStepRegisteredAddressMaxLength,
      required: markedAsComplete,
    }),
  });

type PcrAddPartnerCompaniesHouseStepSearchSchemaType = typeof pcrAddPartnerCompaniesHouseStepSearchSchema;
type PcrAddPartnerCompaniesHouseStepSchemaType = ReturnType<typeof getPcrAddPartnerCompaniesHouseStepSchema>;

export {
  getPcrAddPartnerCompaniesHouseStepSchema,
  pcrAddPartnerCompaniesHouseStepErrorMap,
  pcrAddPartnerCompaniesHouseStepSearchSchema,
  pcrAddPartnerCompaniesHouseStepSearchSelectSchema,
  pcrAddPartnerCompaniesHouseStepSearchMaxLength,
  pcrAddPartnerCompaniesHouseStepOrganisationNameMaxLength,
  pcrAddPartnerCompaniesHouseStepRegistrationNumberMaxLength,
  pcrAddPartnerCompaniesHouseStepRegisteredAddressMaxLength,
};

export type { PcrAddPartnerCompaniesHouseStepSchemaType, PcrAddPartnerCompaniesHouseStepSearchSchemaType };
