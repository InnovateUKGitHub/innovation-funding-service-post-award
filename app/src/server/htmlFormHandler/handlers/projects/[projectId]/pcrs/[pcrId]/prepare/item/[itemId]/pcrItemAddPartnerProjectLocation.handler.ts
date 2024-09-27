import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { PCRPrepareItemRoute, ProjectChangeRequestPrepareItemParams } from "@ui/pages/pcrs/pcrItemWorkflowContainer";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { addPartnerErrorMap } from "@ui/pages/pcrs/addPartner/addPartnerSummary.zod";
import { getNextAddPartnerStep, updatePcrItem } from "./addPartnerUtils";
import {
  ProjectLocationSchemaType,
  getProjectLocationSchema,
} from "@ui/pages/pcrs/addPartner/steps/schemas/projectLocation.zod";

export class PcrItemAddPartnerProjectLocationHandler extends ZodFormHandlerBase<
  ProjectLocationSchemaType,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrAddPartnerProjectLocationStep],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema({ input }: { input: AnyObject }) {
    return {
      schema: getProjectLocationSchema(input.markedAsComplete === "true"),
      errorMap: addPartnerErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<ProjectLocationSchemaType>> {
    return {
      form: input.form,
      markedAsComplete: input.markedAsComplete,
      button_submit: input.button_submit,
      projectLocation: input.projectLocation,
      projectCity: input.projectCity,
      projectPostcode: input.projectPostcode,
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<ProjectLocationSchemaType>;
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
