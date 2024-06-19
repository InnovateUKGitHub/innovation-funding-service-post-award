import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

export const getAcademicOrganisationSchema = (markedAsComplete: boolean) =>
  markedAsComplete
    ? z.object({
        form: z.literal(FormTypes.PcrAddPartnerAcademicOrganisationStep),
        markedAsComplete: z.string(),
        button_submit: z.string(),
        organisationName: z.string().min(1),
      })
    : z.object({
        form: z.literal(FormTypes.PcrAddPartnerAcademicOrganisationStep),
        markedAsComplete: z.string(),
        button_submit: z.string(),
        organisationName: z.string().nullable().optional(),
      });

export const academicOrganisationSearchSchema = z.object({
  form: z.literal(FormTypes.PcrAddPartnerAcademicOrganisationSearchStep),
  searchJesOrganisations: z.string().optional(),
});

export type AcademicOrganisationSchemaType = ReturnType<typeof getAcademicOrganisationSchema>;
export type AcademicOrganisationSchema = z.infer<AcademicOrganisationSchemaType>;

export type AcademicOrganisationSearchSchemaType = typeof academicOrganisationSearchSchema;
