import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { PCRPrepareItemRoute, ProjectChangeRequestPrepareItemParams } from "@ui/pages/pcrs/pcrItemWorkflowContainer";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

import { addPartnerErrorMap } from "@ui/pages/pcrs/addPartner/addPartnerSummary.zod";
import { getNextAddPartnerStep } from "./addPartnerUtils";
import {
  FinanceContactSchemaType,
  getFinanceContactSchema,
} from "@ui/pages/pcrs/addPartner/steps/schemas/financeContact.zod";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";
import { PcrContactRoleMapper } from "@framework/mappers/pcr";
import { PCRContactRole, PCRItemStatus } from "@framework/constants/pcrConstants";

export class PcrItemAddPartnerFinanceContactHandler extends ZodFormHandlerBase<
  FinanceContactSchemaType,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrAddPartnerFinanceContactStep],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema({ input }: { input: AnyObject }) {
    return {
      schema: getFinanceContactSchema(input.markedAsComplete === "true"),
      errorMap: addPartnerErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<FinanceContactSchemaType>> {
    return {
      form: input.form,
      button_submit: input.button_submit,
      markedAsComplete: input.markedAsComplete,
      contact1Email: input.contact1Email,
      contact1Forename: input.contact1Forename,
      contact1Surname: input.contact1Surname,
      contact1Phone: input.contact1Phone,
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<FinanceContactSchemaType>;
    context: IContext;
    params: ProjectChangeRequestPrepareItemParams;
  }): Promise<string> {
    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: params.itemId,
      Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(PCRItemStatus.Incomplete),
      Acc_Contact1ProjectRole__c: new PcrContactRoleMapper().mapToSalesforcePCRProjectRole(
        PCRContactRole.FinanceContact,
      ),
      Acc_Contact1Forename__c: input.contact1Forename,
      Acc_Contact1Surname__c: input.contact1Surname,
      Acc_Contact1Phone__c: input.contact1Phone,
      Acc_Contact1EmailAddress__c: input.contact1Email,
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
