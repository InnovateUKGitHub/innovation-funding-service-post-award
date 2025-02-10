import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { PCRPrepareItemRoute, ProjectChangeRequestPrepareItemParams } from "@ui/pages/pcrs/pcrItemWorkflowContainer";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { ProjectChangeRequestPrepareRoute } from "@ui/pages/pcrs/overview/projectChangeRequestPrepare.page";
import { PCRItemStatus, PCRItemType } from "@framework/constants/pcrConstants";
import {
  AddPartnerSchemaType,
  addPartnerSummarySchema,
  addPartnerErrorMap,
} from "@ui/pages/pcrs/addPartner/addPartnerSummary.zod";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";

export class PcrAddPartnerSummaryHandler extends ZodFormHandlerBase<
  AddPartnerSchemaType,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrAddPartnerSummary],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: addPartnerSummarySchema,
      errorMap: addPartnerErrorMap,
    };
  }

  private async getItem({
    context,
    projectId,
    pcrId,
    pcrItemId,
  }: {
    context: IContext;
    projectId: ProjectId;
    pcrId: PcrId;
    pcrItemId: PcrItemId;
  }) {
    const pcr = await context.runQuery(new GetPCRByIdQuery(projectId, pcrId));
    const item = pcr.items.find(x => x.id === pcrItemId && x.type === PCRItemType.PartnerAddition);
    if (!item) throw new Error("Cannot find PCR item ID");
    return item as PCRItemForPartnerAdditionDto;
  }

  protected async mapToZod({
    input,
    params,
    context,
  }: {
    input: AnyObject;
    params: ProjectChangeRequestPrepareItemParams;
    context: IContext;
  }): Promise<z.input<AddPartnerSchemaType>> {
    const pcrItem = await this.getItem({
      context,
      projectId: params.projectId,
      pcrId: params.pcrId,
      pcrItemId: params.itemId,
    });

    return {
      form: FormTypes.PcrAddPartnerSummary,
      ...pcrItem,
      markedAsComplete: input.markedAsComplete === "on",
    };
  }

  protected async run({
    context,
    params,
    input,
  }: {
    input: z.output<AddPartnerSchemaType>;
    context: IContext;
    params: ProjectChangeRequestPrepareItemParams;
  }): Promise<string> {
    const status = input.markedAsComplete ? PCRItemStatus.Complete : PCRItemStatus.Incomplete;

    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: params.itemId,
      Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(status),
    });

    return ProjectChangeRequestPrepareRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
    }).path;
  }
}
