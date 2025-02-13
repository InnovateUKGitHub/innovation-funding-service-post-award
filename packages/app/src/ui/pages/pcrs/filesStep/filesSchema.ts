import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

export const getFilesStepSchema = (form: FormTypes) =>
  z.object({
    form: z.literal(form),
    markedAsComplete: z.boolean().optional(),
    button_submit: z.string().optional(),
  });

export type FilesStepSchema = ReturnType<typeof getFilesStepSchema>;
