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
  OrganisationDetailsSchemaType,
  getOrganisationDetailsSchema,
} from "@ui/containers/pages/pcrs/addPartner/steps/schemas/organisationDetails.zod";

export class PcrItemAddPartnerOrganisationDetailsHandler extends ZodFormHandlerBase<
  OrganisationDetailsSchemaType,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrAddPartnerOrganisationDetailsStep],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema({ input }: { input: AnyObject }) {
    return {
      schema: getOrganisationDetailsSchema(input.markedAsComplete === "true"),
      errorMap: addPartnerErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<OrganisationDetailsSchemaType>> {
    return {
      form: input.form,
      markedAsComplete: input.markedAsComplete,
      button_submit: input.button_submit,
      participantSize: input.participantSize ?? 0,
      numberOfEmployees: input.numberOfEmployees,
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<OrganisationDetailsSchemaType>;
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
