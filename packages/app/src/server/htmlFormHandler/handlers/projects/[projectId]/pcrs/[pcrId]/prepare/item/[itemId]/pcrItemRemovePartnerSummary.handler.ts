import { IContext } from "@framework/types/IContext";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { PCRPrepareItemRoute, ProjectChangeRequestPrepareItemParams } from "@ui/pages/pcrs/pcrItemWorkflowContainer";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { ProjectChangeRequestPrepareRoute } from "@ui/pages/pcrs/overview/projectChangeRequestPrepare.page";
import { PCRItemType } from "@framework/constants/pcrConstants";
import { PCRItemForPartnerWithdrawalDto } from "@framework/dtos/pcrDtos";
import {
  RemovePartnerSchema,
  removePartnerSchema,
  removePartnerErrorMap,
} from "@ui/pages/pcrs/removePartner/removePartner.zod";
import { handlePcrItemStatus } from "@server/repositories/projectChangeRequestRepository";

export class PcrItemChangeRemovePartnerSummaryHandler extends ZodFormHandlerBase<
  RemovePartnerSchema,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrRemovePartnerSummary],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: removePartnerSchema,
      errorMap: removePartnerErrorMap,
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
    const item = pcr.items.find(x => x.id === pcrItemId && x.type === PCRItemType.PartnerWithdrawal);
    if (!item) throw new Error("Cannot find PCR item ID");
    return item as PCRItemForPartnerWithdrawalDto;
  }

  protected async mapToZod({
    input,
    context,
    params,
  }: {
    input: AnyObject;
    context: IContext;
    params: ProjectChangeRequestPrepareItemParams;
  }): Promise<z.input<RemovePartnerSchema>> {
    const item = await this.getItem({
      context,
      projectId: params.projectId,
      pcrId: params.pcrId,
      pcrItemId: params.itemId,
    });

    return {
      form: input.form,
      removalPeriod: item.removalPeriod,
      partnerId: item?.partnerId,
      markedAsComplete: input.markedAsComplete === "on",
      numberOfPeriods: Number(input.numberOfPeriods),
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<RemovePartnerSchema>;
    context: IContext;
    params: ProjectChangeRequestPrepareItemParams;
  }): Promise<string> {
    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: params.itemId,
      Acc_MarkedasComplete__c: handlePcrItemStatus(
        FormTypes.PcrRemovePartnerSummary,
        input.markedAsComplete,
        input.form,
      ),
      Acc_RemovalPeriod__c: input.removalPeriod,
      Acc_Project_Participant__c: input.partnerId,
    });

    return ProjectChangeRequestPrepareRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
    }).path;
  }
}
