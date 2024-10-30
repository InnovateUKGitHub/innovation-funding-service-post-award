import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { PCRPrepareItemRoute, ProjectChangeRequestPrepareItemParams } from "@ui/pages/pcrs/pcrItemWorkflowContainer";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

import { setData } from "@ui/pages/pcrs/addPartner/steps/roleAndOrganisationStep";
import {
  RoleAndOrganisationSchemaType,
  roleAndOrganisationSchema,
} from "@ui/pages/pcrs/addPartner/steps/schemas/roleAndOrganisation.zod";
import { addPartnerErrorMap } from "@ui/pages/pcrs/addPartner/addPartnerSummary.zod";
import { getNextAddPartnerStep, updatePcrItem } from "./addPartnerUtils";

export class PcrItemAddPartnerRoleAndOrganisationHandler extends ZodFormHandlerBase<
  RoleAndOrganisationSchemaType,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrAddPartnerRoleAndOrganisationStep],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: roleAndOrganisationSchema,
      errorMap: addPartnerErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<RoleAndOrganisationSchemaType>> {
    return {
      form: input.form,
      button_submit: input.button_submit,
      projectRole: input.projectRole,
      isCommercialWork: input.isCommercialWork,
      partnerType: input.partnerType,
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<RoleAndOrganisationSchemaType>;
    context: IContext;
    params: ProjectChangeRequestPrepareItemParams;
  }): Promise<string> {
    await updatePcrItem({ params, context, data: setData(input) });

    return await getNextAddPartnerStep({
      projectId: params.projectId,
      pcrId: params.pcrId,
      pcrItemId: params.itemId,
      context,
      toSummary: input.button_submit === "saveAndReturn",
      stepNumber: params.step,
    });
  }
}
