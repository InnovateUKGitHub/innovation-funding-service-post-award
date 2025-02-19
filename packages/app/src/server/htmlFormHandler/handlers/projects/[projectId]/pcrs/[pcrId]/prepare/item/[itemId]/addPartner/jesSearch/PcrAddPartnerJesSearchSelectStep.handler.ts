import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { addPartnerErrorMap } from "@ui/pages/pcrs/addPartner/addPartnerSummary.zod";
import { PCRPrepareItemRoute, ProjectChangeRequestPrepareItemParams } from "@ui/pages/pcrs/pcrItemWorkflowContainer";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { getAddPartnerStep } from "../../addPartnerUtils";
import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";
import {
  AcademicOrganisationSchemaType,
  getAcademicOrganisationSchema,
} from "@ui/pages/pcrs/addPartner/steps/schemas/academicOrganisation.zod";

export class PcrAddPartnerJesSearchSelectStepHandler extends ZodFormHandlerBase<
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
      accountId: input.accountId,
      button_submit: input.button_submit,
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<AcademicOrganisationSchemaType>;
    context: IContext;
    params: ProjectChangeRequestPrepareItemParams;
  }) {
    if (input.accountId !== "search" && input.accountId) {
      const account = await context.repositories.accounts.getById(input.accountId);

      if (account.JES_Organisation__c !== "Yes") throw new Error("not a jes");

      await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
        Id: params.itemId,
        Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(PCRItemStatus.Incomplete),
        Acc_OrganisationName__c: account.Name,
        Acc_Account__c: account.Id,
      });
    }

    return await getAddPartnerStep({
      projectId: params.projectId,
      pcrId: params.pcrId,
      pcrItemId: params.itemId,
      context,
      toSummary: false,
      stepNumber: params.step,
      nextStep: input.accountId !== "search",
      params: {
        search: input.accountId === "search" ? "" : undefined,
      },
    });
  }
}
