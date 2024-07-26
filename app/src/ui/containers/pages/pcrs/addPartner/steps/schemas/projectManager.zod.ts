import { FormTypes } from "@ui/zod/FormTypes";
import { getTextareaValidation } from "@ui/zod/textareaValidator.zod";
import { z } from "zod";

export const getProjectManagerSchema = (markedAsComplete: boolean) =>
  z.object({
    form: z.literal(FormTypes.PcrAddPartnerProjectManagerStep),
    markedAsComplete: z.string(),
    button_submit: z.string(),
    contact2Forename: getTextareaValidation({ required: markedAsComplete, maxLength: 50 }),
    contact2Surname: getTextareaValidation({ required: markedAsComplete, maxLength: 50 }),
    contact2Phone: getTextareaValidation({ required: markedAsComplete, maxLength: 20 }),
    contact2Email: getTextareaValidation({ required: markedAsComplete, maxLength: 255 }),
  });

export type ProjectManagerSchemaType = ReturnType<typeof getProjectManagerSchema>;

export type ProjectManagerSchema = z.infer<ProjectManagerSchemaType>;
