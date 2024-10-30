import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { PCROrganisationType, PCRProjectLocation, PCRProjectRole } from "@framework/constants/pcrConstants";
import { FormTypes } from "@ui/zod/FormTypes";
import { getTextValidation } from "@ui/zod/textareaValidator.zod";
import { evaluateObject } from "@ui/zod/helperValidators/helperValidators.zod";
import { getNumberValidation } from "@ui/zod/numericValidator.zod";

export const addPartnerErrorMap = makeZodI18nMap({ keyPrefix: ["pcr", "addPartner"] });

export const getAddPartnerSummarySchema = ({
  projectRole,
  organisationType,
}: {
  projectRole: PCRProjectRole;
  organisationType: PCROrganisationType;
}) =>
  evaluateObject(({ markedAsComplete: required }) => ({
    organisationName: getTextValidation({ required, maxLength: 256 }),
    registrationNumber: getTextValidation({
      required: required && organisationType === PCROrganisationType.Industrial,
      maxLength: 40,
    }),
    registeredAddress: getTextValidation({
      required: required && organisationType === PCROrganisationType.Industrial,
      maxLength: 32768,
    }),
    participantSize: required ? z.number().gt(0) : z.number().nullable().optional(),
    numberOfEmployees: getNumberValidation({
      min: 0,
      lt: 100_000_000,
      required: required && organisationType === PCROrganisationType.Industrial,
    }),
    financialYearEndDate:
      required && organisationType === PCROrganisationType.Industrial ? z.date() : z.date().nullable().optional(),
    financialYearEndTurnover: getNumberValidation({
      min: 0,
      required: required && organisationType === PCROrganisationType.Industrial,
    }),
    projectLocation: required
      ? z
          .number()
          .gt(0)
          .transform(x => x as PCRProjectLocation)
      : z
          .number()
          .transform(x => x as PCRProjectLocation)
          .nullable()
          .optional(),
    projectCity: getTextValidation({ required, maxLength: 40 }),
    projectPostcode: getTextValidation({ required: false, maxLength: 10 }),
    contact1Forename: getTextValidation({ required, maxLength: 50 }),
    contact1Surname: getTextValidation({ required, maxLength: 50 }),
    contact1Phone: getTextValidation({ required, maxLength: 20 }),
    contact1Email: getTextValidation({ required, maxLength: 255 }),
    contact2Forename: getTextValidation({
      required: required && projectRole === PCRProjectRole.ProjectLead,
      maxLength: 50,
    }),
    contact2Phone: getTextValidation({
      required: required && projectRole === PCRProjectRole.ProjectLead,
      maxLength: 20,
    }),
    contact2Surname: getTextValidation({
      required: required && projectRole === PCRProjectRole.ProjectLead,
      maxLength: 255,
    }),
    contact2Email: getTextValidation({
      required: required && projectRole === PCRProjectRole.ProjectLead,
      maxLength: 50,
    }),
    awardRate: getNumberValidation({ min: 0, max: 100, required }),
    partnerType: z.number().gt(0),
    projectRole: z.number().gt(0),
    isCommercialWork: required ? z.boolean() : z.boolean().nullable().optional(),
    hasOtherFunding: required ? z.boolean() : z.boolean().nullable().optional(),
    organisationType: getTextValidation({
      required: true,
      maxLength: 255,
    }),
    tsbReference: getTextValidation({
      required: required && organisationType === PCROrganisationType.Academic,
      maxLength: 255,
    }),
    markedAsComplete: z.literal(required),
    form: z.literal(FormTypes.PcrAddPartnerSummary),
  }));

export type AddPartnerSchemaType = ReturnType<typeof getAddPartnerSummarySchema>;
export type AddPartnerSchema = Omit<z.output<AddPartnerSchemaType>, "markedAsComplete"> & {
  markedAsComplete: boolean;
};
