import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

export const getProjectLocationSchema = (markedAsComplete: boolean) =>
  markedAsComplete
    ? z.object({
        markedAsComplete: z.string(),
        form: z.literal(FormTypes.PcrAddPartnerProjectLocationStep),
        button_submit: z.string(),
        projectLocation: z.coerce.number().gt(0),
        projectCity: z.string().min(1).max(40),
        projectPostcode: z.string().max(10),
      })
    : z.object({
        markedAsComplete: z.string(),
        form: z.literal(FormTypes.PcrAddPartnerProjectLocationStep),
        button_submit: z.string(),
        projectLocation: z.coerce.number().gt(0),
        projectCity: z.string().max(40),
        projectPostcode: z.string().max(10),
      });

export type ProjectLocationSchemaType = ReturnType<typeof getProjectLocationSchema>;
export type ProjectLocationSchema = z.infer<ProjectLocationSchemaType>;
