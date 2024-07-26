import { z } from "zod";
import { makeZodI18nMap } from "@shared/zodi18n";
import { PCROrganisationType, PCRProjectLocation, PCRProjectRole } from "@framework/constants/pcrConstants";
import { FormTypes } from "@ui/zod/FormTypes";
import { getTextareaValidation } from "@ui/zod/textareaValidator.zod";
import { evaluateObject } from "@ui/zod/helperValidators.zod";

export const addPartnerErrorMap = makeZodI18nMap({ keyPrefix: ["pcr", "addPartner"] });

export const getAddPartnerSummarySchema = ({
  projectRole,
  organisationType,
}: {
  projectRole: PCRProjectRole;
  organisationType: PCROrganisationType;
}) =>
  evaluateObject(({ markedAsComplete: required }) => ({
    organisationName: getTextareaValidation({ required, maxLength: 256 }),
    registrationNumber: getTextareaValidation({
      required: required && organisationType === PCROrganisationType.Industrial,
      maxLength: 40,
    }),
    registeredAddress: getTextareaValidation({
      required: required && organisationType === PCROrganisationType.Industrial,
      maxLength: 32768,
    }),
    participantSize: required ? z.number().gt(0) : z.number().nullable().optional(),
    numberOfEmployees: required && PCROrganisationType.Industrial ? z.number() : z.number().nullable().optional(),
    financialYearEndDate: required && PCROrganisationType.Industrial ? z.date() : z.date().nullable().optional(),
    financialYearEndTurnover:
      required && PCROrganisationType.Industrial ? z.number().min(0) : z.number().nullable().optional(),
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
    projectCity: getTextareaValidation({ required, maxLength: 40 }),
    projectPostcode: getTextareaValidation({ required: false, maxLength: 10 }),
    contact1Forename: getTextareaValidation({ required, maxLength: 50 }),
    contact1Surname: getTextareaValidation({ required, maxLength: 50 }),
    contact1Phone: getTextareaValidation({ required, maxLength: 20 }),
    contact1Email: getTextareaValidation({ required, maxLength: 255 }),
    contact2Forename: getTextareaValidation({
      required: required && projectRole === PCRProjectRole.ProjectLead,
      maxLength: 50,
    }),
    contact2Phone: getTextareaValidation({
      required: required && projectRole === PCRProjectRole.ProjectLead,
      maxLength: 20,
    }),
    contact2Surname: getTextareaValidation({
      required: required && projectRole === PCRProjectRole.ProjectLead,
      maxLength: 255,
    }),
    contact2Email: getTextareaValidation({
      required: required && projectRole === PCRProjectRole.ProjectLead,
      maxLength: 50,
    }),
    awardRate: required ? z.number() : z.number().nullable().optional(),
    partnerType: z.number().gt(0),
    projectRole: z.number().gt(0),
    isCommercialWork: required ? z.boolean() : z.boolean().nullable().optional(),
    hasOtherFunding: required ? z.boolean() : z.boolean().nullable().optional(),
    organisationType: getTextareaValidation({
      required: true,
      maxLength: 255,
    }),
    tsbReference: getTextareaValidation({
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
