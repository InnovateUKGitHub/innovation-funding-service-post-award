import { FormTypes } from "@ui/zod/FormTypes";
import { getTextValidation } from "@ui/zod/textareaValidator.zod";
import { z } from "zod";

export const getProjectManagerSchema = (markedAsComplete: boolean) =>
  z.object({
    form: z.literal(FormTypes.PcrAddPartnerProjectManagerStep),
    markedAsComplete: z.string(),
    button_submit: z.string(),
    contact2Forename: getTextValidation({ required: markedAsComplete, maxLength: 50 }),
    contact2Surname: getTextValidation({ required: markedAsComplete, maxLength: 50 }),
    contact2Phone: getTextValidation({ required: markedAsComplete, maxLength: 20 }),
    contact2Email: getTextValidation({ required: markedAsComplete, maxLength: 255 }),
  });

export type ProjectManagerSchemaType = ReturnType<typeof getProjectManagerSchema>;

export type ProjectManagerSchema = z.infer<ProjectManagerSchemaType>;
