import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { PCRPrepareItemRoute, ProjectChangeRequestPrepareItemParams } from "@ui/pages/pcrs/pcrItemWorkflowContainer";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

import { addPartnerErrorMap } from "@ui/pages/pcrs/addPartner/addPartnerSummary.zod";
import { getNextAddPartnerStep } from "./addPartnerUtils";
import {
  ProjectManagerSchemaType,
  getProjectManagerSchema,
} from "@ui/pages/pcrs/addPartner/steps/schemas/projectManager.zod";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";
import { PCRContactRole, PCRItemStatus } from "@framework/constants/pcrConstants";
import { PcrContactRoleMapper } from "@framework/mappers/pcr";

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
      markedAsComplete: input.markedAsComplete === "true",
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
    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: params.itemId,
      Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(PCRItemStatus.Incomplete),
      Acc_Contact2ProjectRole__c: new PcrContactRoleMapper().mapToSalesforcePCRProjectRole(
        PCRContactRole.ProjectManager,
      ),
      Acc_Contact2Forename__c: input.contact2Forename,
      Acc_Contact2Surname__c: input.contact2Surname,
      Acc_Contact2Phone__c: input.contact2Phone,
      Acc_Contact2EmailAddress__c: input.contact2Email,
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
