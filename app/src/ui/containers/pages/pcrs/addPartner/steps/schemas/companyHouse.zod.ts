import { z } from "zod";

export const getCompaniesHouseSchema = (markedAsComplete: boolean) =>
  markedAsComplete
    ? z.object({
        button_submit: z.string(),
        organisationName: z.string().min(1),
        registrationNumber: z.string().min(1),
        registeredAddress: z.string().min(1),
        searchResults: z.string(),
      })
    : z.object({
        button_submit: z.string(),
        organisationName: z.string(),
        registrationNumber: z.string(),
        registeredAddress: z.string(),
        searchResults: z.string(),
      });

export type CompaniesHouseSchema = z.infer<ReturnType<typeof getCompaniesHouseSchema>>;
