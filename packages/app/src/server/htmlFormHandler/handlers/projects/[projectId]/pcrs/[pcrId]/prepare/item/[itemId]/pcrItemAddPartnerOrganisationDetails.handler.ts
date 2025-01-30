import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { PCRPrepareItemRoute, ProjectChangeRequestPrepareItemParams } from "@ui/pages/pcrs/pcrItemWorkflowContainer";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

import { addPartnerErrorMap } from "@ui/pages/pcrs/addPartner/addPartnerSummary.zod";
import { getNextAddPartnerStep } from "./addPartnerUtils";
import {
  OrganisationDetailsSchemaType,
  getOrganisationDetailsSchema,
} from "@ui/pages/pcrs/addPartner/steps/schemas/organisationDetails.zod";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";
import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { PcrParticipantSizeMapper } from "@framework/mappers/participantSize";

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
    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: params.itemId,
      Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(PCRItemStatus.Incomplete),
      Acc_ParticipantSize__c: new PcrParticipantSizeMapper().mapToSalesforcePCRParticipantSize(input.participantSize),
      Acc_Employees__c: input.numberOfEmployees,
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
