import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { PCRItemForApproveNewSubcontractorDto } from "@framework/dtos/pcrDtos";
import { IContext } from "@framework/types/IContext";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";
import {
  ApproveNewSubcontractorSchemaType,
  approveNewSubcontractorErrorMap,
  approveNewSubcontractorSchema,
} from "@ui/pages/pcrs/approveNewSubcontractor/ApproveNewSubcontractor.zod";
import { ProjectChangeRequestPrepareRoute } from "@ui/pages/pcrs/overview/projectChangeRequestPrepare.page";
import { PCRPrepareItemRoute, ProjectChangeRequestPrepareItemParams } from "@ui/pages/pcrs/pcrItemWorkflowContainer";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

class ProjectChangeRequestItemApproveNewSubcontractorSummaryUpdateHandler extends ZodFormHandlerBase<
  ApproveNewSubcontractorSchemaType,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrApproveNewSubcontractorSummary],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: approveNewSubcontractorSchema,
      errorMap: approveNewSubcontractorErrorMap,
    };
  }

  protected async mapToZod({
    input,
    context,
  }: {
    input: AnyObject;
    context: IContext;
  }): Promise<z.input<ApproveNewSubcontractorSchemaType>> {
    const pcr = await context.runQuery(new GetPCRByIdQuery(input.projectId, input.pcrId));
    const pcrItem = pcr.items.find(x => x.id === input.pcrItemId);
    if (!pcrItem) throw new Error("Cannot find PCR item ID");

    const {
      subcontractorCost,
      subcontractorDescription,
      subcontractorJustification,
      subcontractorLocation,
      subcontractorName,
      subcontractorRegistrationNumber,
      subcontractorRelationship,
      subcontractorRelationshipJustification,
    } = pcrItem as PCRItemForApproveNewSubcontractorDto;

    return {
      form: FormTypes.PcrApproveNewSubcontractorSummary,
      markedAsComplete: input.markedAsComplete === "on",
      subcontractorDescription: subcontractorDescription ?? "",
      subcontractorJustification: subcontractorJustification ?? "",
      subcontractorLocation: subcontractorLocation ?? "",
      subcontractorName: subcontractorName ?? "",
      subcontractorRegistrationNumber: subcontractorRegistrationNumber ?? "",
      subcontractorRelationship: subcontractorRelationship ?? false,
      subcontractorRelationshipJustification: subcontractorRelationshipJustification ?? "",
      subcontractorCost: String(subcontractorCost ?? 0),
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
      Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(
        input.markedAsComplete ? PCRItemStatus.Complete : PCRItemStatus.Incomplete,
      ),
    });
    return ProjectChangeRequestPrepareRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
    }).path;
  }
}

export { ProjectChangeRequestItemApproveNewSubcontractorSummaryUpdateHandler };
