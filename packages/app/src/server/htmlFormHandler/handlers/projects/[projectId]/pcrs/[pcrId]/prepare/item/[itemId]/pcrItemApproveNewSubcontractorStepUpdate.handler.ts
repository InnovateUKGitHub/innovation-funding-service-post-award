import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { IContext } from "@framework/types/IContext";
import { parseCurrency } from "@framework/util/numberHelper";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
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
      projectId: input.projectId,
      pcrId: input.pcrId,
      pcrItemId: input.pcrItemId,
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
  }: {
    input: z.output<ApproveNewSubcontractorSchemaType>;
    context: IContext;
  }): Promise<string> {
    await context.runCommand(
      new UpdatePCRCommand({
        projectId: input.projectId,
        projectChangeRequestId: input.pcrId,
        pcr: {
          projectId: input.projectId,
          id: input.pcrId,
          items: [
            {
              id: input.pcrItemId,
              status: input.markedAsComplete ? PCRItemStatus.Complete : PCRItemStatus.Incomplete,
              subcontractorDescription: input.subcontractorDescription,
              subcontractorJustification: input.subcontractorJustification,
              subcontractorLocation: input.subcontractorLocation,
              subcontractorName: input.subcontractorName,
              subcontractorRegistrationNumber: input.subcontractorRegistrationNumber,
              subcontractorRelationship: input.subcontractorRelationship,
              subcontractorRelationshipJustification: input.subcontractorRelationshipJustification,
              subcontractorCost: parseCurrency(input.subcontractorCost),
            },
          ],
        },
      }),
    );

    return PCRPrepareItemRoute.getLink({
      projectId: input.projectId,
      pcrId: input.pcrId,
      itemId: input.pcrItemId,
    }).path;
  }
}

export { ProjectChangeRequestItemApproveNewSubcontractorStepUpdateHandler };
