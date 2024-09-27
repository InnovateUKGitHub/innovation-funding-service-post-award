import { IContext } from "@framework/types/IContext";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { PCRPrepareItemRoute, ProjectChangeRequestPrepareItemParams } from "@ui/pages/pcrs/pcrItemWorkflowContainer";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { ProjectChangeRequestPrepareRoute } from "@ui/pages/pcrs/overview/projectChangeRequestPrepare.page";
import { PCRItemStatus, PCRItemType } from "@framework/constants/pcrConstants";
import { PCRItemForPartnerWithdrawalDto } from "@framework/dtos/pcrDtos";
import {
  RemovePartnerSchema,
  getRemovePartnerSchema,
  removePartnerErrorMap,
} from "@ui/pages/pcrs/removePartner/removePartner.zod";
import { GetByIdQuery } from "@server/features/projects/getDetailsByIdQuery";

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

  protected async getZodSchema({
    context,
    params,
  }: {
    context: IContext;
    params: ProjectChangeRequestPrepareItemParams;
  }) {
    const project = await context.runQuery(new GetByIdQuery(params.projectId));

    return {
      schema: getRemovePartnerSchema(project.numberOfPeriods),
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
    await context.runCommand(
      new UpdatePCRCommand({
        projectId: params.projectId,
        projectChangeRequestId: params.pcrId,
        pcr: {
          projectId: params.projectId,
          id: params.pcrId,
          items: [
            {
              id: params.itemId,
              removalPeriod: input.removalPeriod,
              partnerId: input.partnerId,
              status: input.markedAsComplete ? PCRItemStatus.Complete : PCRItemStatus.Incomplete,
            },
          ],
        },
      }),
    );

    return ProjectChangeRequestPrepareRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
    }).path;
  }
}
