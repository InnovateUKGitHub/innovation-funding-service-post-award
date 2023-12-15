import { z } from "zod";

export const getAcademicOrganisationSchema = (markedAsComplete: boolean) =>
  markedAsComplete
    ? z.object({
        button_submit: z.string(),
        organisationName: z.string().min(1),
      })
    : z.object({
        button_submit: z.string(),
        organisationName: z.string().nullable().optional(),
      });

export type AcademicOrganisationSchema = z.infer<ReturnType<typeof getAcademicOrganisationSchema>>;
