import { FormTypes } from "@ui/zod/FormTypes";
import { getTextValidation } from "@ui/zod/textareaValidator.zod";
import { z } from "zod";

export const getProjectLocationSchema = (markedAsComplete: boolean) =>
  z.object({
    markedAsComplete: z.string(),
    form: z.literal(FormTypes.PcrAddPartnerProjectLocationStep),
    button_submit: z.string(),
    projectLocation: z.coerce.number().gt(0),
    projectCity: getTextValidation({ required: markedAsComplete, maxLength: 40 }),
    projectPostcode: getTextValidation({ required: false, maxLength: 10 }),
  });

export type ProjectLocationSchemaType = ReturnType<typeof getProjectLocationSchema>;
export type ProjectLocationSchema = z.infer<ProjectLocationSchemaType>;
