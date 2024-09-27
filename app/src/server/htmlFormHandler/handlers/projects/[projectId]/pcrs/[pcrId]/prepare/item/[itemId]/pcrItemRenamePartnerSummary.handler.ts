import { IContext } from "@framework/types/IContext";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { GetAllForProjectQuery } from "@server/features/partners/getAllForProjectQuery";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { PCRPrepareItemRoute, ProjectChangeRequestPrepareItemParams } from "@ui/pages/pcrs/pcrItemWorkflowContainer";
import {
  RenamePartnerSchema,
  getRenamePartnerSchema,
  renamePartnerErrorMap,
} from "@ui/pages/pcrs/renamePartner/renamePartner.zod";

import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { ProjectChangeRequestPrepareRoute } from "@ui/pages/pcrs/overview/projectChangeRequestPrepare.page";
import { PCRItemStatus, PCRItemType } from "@framework/constants/pcrConstants";
import { PCRItemForAccountNameChangeDto } from "@framework/dtos/pcrDtos";

export class PcrItemChangeRenamePartnerSummaryHandler extends ZodFormHandlerBase<
  RenamePartnerSchema,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrRenamePartnerSummary],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema({ context, input }: { context: IContext; input: z.input<RenamePartnerSchema> }) {
    const partners = await context.runQuery(new GetAllForProjectQuery(input.projectId as ProjectId));

    return {
      schema: getRenamePartnerSchema(partners),
      errorMap: renamePartnerErrorMap,
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
    const item = pcr.items.find(x => x.id === pcrItemId && x.type === PCRItemType.AccountNameChange);
    if (!item) throw new Error("Cannot find PCR item ID");
    return item as PCRItemForAccountNameChangeDto;
  }

  protected async mapToZod({
    input,
    context,
  }: {
    input: AnyObject;
    context: IContext;
  }): Promise<z.input<RenamePartnerSchema>> {
    const item = await this.getItem({
      context,
      projectId: input.projectId,
      pcrId: input.pcrId,
      pcrItemId: input.pcrItemId,
    });

    return {
      form: input.form,
      projectId: input.projectId,
      pcrId: input.pcrId,
      pcrItemId: input.pcrItemId,
      partnerId: item?.partnerId,
      accountName: item?.accountName ?? undefined,
      markedAsComplete: input.markedAsComplete === "on",
    };
  }

  protected async run({
    input,
    context,
  }: {
    input: z.output<RenamePartnerSchema>;
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
              accountName: input.accountName,
              partnerId: input.partnerId,
              status: input.markedAsComplete ? PCRItemStatus.Complete : PCRItemStatus.Incomplete,
            },
          ],
        },
      }),
    );

    return ProjectChangeRequestPrepareRoute.getLink({
      projectId: input.projectId,
      pcrId: input.pcrId,
    }).path;
  }
}
