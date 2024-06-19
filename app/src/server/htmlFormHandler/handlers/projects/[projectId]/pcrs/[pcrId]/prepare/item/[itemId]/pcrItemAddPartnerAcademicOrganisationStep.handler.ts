import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import {
  PCRPrepareItemRoute,
  ProjectChangeRequestPrepareItemParams,
} from "@ui/containers/pages/pcrs/pcrItemWorkflowContainer";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { getNextAddPartnerStep, updatePcrItem } from "./addPartnerUtils";
import {
  AcademicOrganisationSchemaType,
  getAcademicOrganisationSchema,
} from "@ui/containers/pages/pcrs/addPartner/steps/schemas/academicOrganisation.zod";
import { addPartnerErrorMap } from "@ui/containers/pages/pcrs/addPartner/addPartnerSummary.zod";

export class PcrItemAddPartnerAcademicOrganisationStepHandler extends ZodFormHandlerBase<
  AcademicOrganisationSchemaType,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrAddPartnerAcademicOrganisationStep],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema({ input }: { input: AnyObject }) {
    return {
      schema: getAcademicOrganisationSchema(input.markedAsComplete === "true"),
      errorMap: addPartnerErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<AcademicOrganisationSchemaType>> {
    return {
      form: input.form,
      organisationName: input.organisationName,
      button_submit: input.button_submit,
      markedAsComplete: input.markedAsComplete,
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<AcademicOrganisationSchemaType>;
    context: IContext;
    params: ProjectChangeRequestPrepareItemParams & { step?: number };
  }): Promise<string> {
    await updatePcrItem({
      params,
      context,
      data: {
        organisationName: input.organisationName,
      },
    });

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
