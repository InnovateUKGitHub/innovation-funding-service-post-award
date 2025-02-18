import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { IContext } from "@framework/types/IContext";
import { parseCurrency } from "@framework/util/numberHelper";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";
import {
  ApproveNewSubcontractorSchemaType,
  approveNewSubcontractorErrorMap,
  approveNewSubcontractorSchema,
} from "@ui/pages/pcrs/approveNewSubcontractor/ApproveNewSubcontractor.zod";
import { PCRPrepareItemRoute, ProjectChangeRequestPrepareItemParams } from "@ui/pages/pcrs/pcrItemWorkflowContainer";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

class ProjectChangeRequestItemApproveNewSubcontractorStepUpdateHandler extends ZodFormHandlerBase<
  ApproveNewSubcontractorSchemaType,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrApproveNewSubcontractorStep],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: approveNewSubcontractorSchema,
      errorMap: approveNewSubcontractorErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<ApproveNewSubcontractorSchemaType>> {
    return {
      form: FormTypes.PcrApproveNewSubcontractorSummary,
      markedAsComplete: input.markedAsComplete === "on",
      subcontractorDescription: input.subcontractorDescription,
      subcontractorJustification: input.subcontractorJustification,
      subcontractorLocation: input.subcontractorLocation,
      subcontractorName: input.subcontractorName,
      subcontractorRegistrationNumber: input.subcontractorRegistrationNumber,
      subcontractorRelationship: input.subcontractorRelationship === "true",

      // If NO RELATIONSHIP selected, set field to empty string
      subcontractorRelationshipJustification:
        input.subcontractorRelationship === "true" ? input.subcontractorRelationshipJustification : "",
      subcontractorCost: input.subcontractorCost,
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<ApproveNewSubcontractorSchemaType>;
    context: IContext;
    params: ProjectChangeRequestPrepareItemParams;
  }): Promise<string> {
    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: params.itemId,
      Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(PCRItemStatus.Incomplete),
      New_company_subcontractor_name__c: input.subcontractorName,
      Company_registration_number__c: input.subcontractorRegistrationNumber,
      // N.B. Field is REQUIRED on Salesforce - Cannot have a unset state :(
      Relationship_between_partners__c: !!input.subcontractorRelationship,
      Relationship_justification__c: !!input.subcontractorRelationship
        ? input.subcontractorRelationshipJustification
        : "",
      Country_where_work_will_be_carried_out__c: input.subcontractorLocation,
      Role_in_the_project__c: input.subcontractorDescription,
      Cost_of_work__c: parseCurrency(input.subcontractorCost),
      Justification__c: input.subcontractorJustification,
    });

    return PCRPrepareItemRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
      itemId: params.itemId,
    }).path;
  }
}

export { ProjectChangeRequestItemApproveNewSubcontractorStepUpdateHandler };
