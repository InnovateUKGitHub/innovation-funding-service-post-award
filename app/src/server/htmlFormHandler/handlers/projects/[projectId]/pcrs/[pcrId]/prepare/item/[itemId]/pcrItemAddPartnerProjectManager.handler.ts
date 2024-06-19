import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import {
  PCRPrepareItemRoute,
  ProjectChangeRequestPrepareItemParams,
} from "@ui/containers/pages/pcrs/pcrItemWorkflowContainer";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

import { addPartnerErrorMap } from "@ui/containers/pages/pcrs/addPartner/addPartnerSummary.zod";
import { getNextAddPartnerStep, updatePcrItem } from "./addPartnerUtils";
import {
  ProjectManagerSchemaType,
  getProjectManagerSchema,
} from "@ui/containers/pages/pcrs/addPartner/steps/schemas/projectManager.zod";

export class PcrItemAddPartnerProjectManagerHandler extends ZodFormHandlerBase<
  ProjectManagerSchemaType,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrAddPartnerProjectManagerStep],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema({ input }: { input: AnyObject }) {
    return {
      schema: getProjectManagerSchema(input.markedAsComplete === "true"),
      errorMap: addPartnerErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<ProjectManagerSchemaType>> {
    return {
      form: input.form,
      button_submit: input.button_submit,
      markedAsComplete: input.markedAsComplete,
      contact2Email: input.contact2Email,
      contact2Forename: input.contact2Forename,
      contact2Surname: input.contact2Surname,
      contact2Phone: input.contact2Phone,
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<ProjectManagerSchemaType>;
    context: IContext;
    params: ProjectChangeRequestPrepareItemParams;
  }): Promise<string> {
    await updatePcrItem({ params, context, data: input });

    return await getNextAddPartnerStep({
      projectId: params.projectId,
      pcrId: params.pcrId,
      pcrItemId: params.itemId,
      context,
      toSummary: input.button_submit === "returnToSummary",
      stepNumber: params.step,
    });
  }
}
