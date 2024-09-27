import { FormTypes } from "@ui/zod/FormTypes";
import { getTextValidation } from "@ui/zod/textareaValidator.zod";
import { z } from "zod";

export const getAcademicOrganisationSchema = (markedAsComplete: boolean) =>
  z.object({
    form: z.literal(FormTypes.PcrAddPartnerAcademicOrganisationStep),
    markedAsComplete: z.string(),
    button_submit: z.string(),
    organisationName: getTextValidation({ required: markedAsComplete, maxLength: 256 }),
  });

export const academicOrganisationSearchSchema = z.object({
  form: z.literal(FormTypes.PcrAddPartnerAcademicOrganisationSearchStep),
  searchJesOrganisations: z.string().optional(),
});

export type AcademicOrganisationSchemaType = ReturnType<typeof getAcademicOrganisationSchema>;
export type AcademicOrganisationSchema = z.infer<AcademicOrganisationSchemaType>;

export type AcademicOrganisationSearchSchemaType = typeof academicOrganisationSearchSchema;
