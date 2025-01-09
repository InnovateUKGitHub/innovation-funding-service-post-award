import { IContext } from "@framework/types/IContext";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { GetAllForProjectQuery } from "@server/features/partners/getAllForProjectQuery";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { PCRPrepareItemRoute, ProjectChangeRequestPrepareItemParams } from "@ui/pages/pcrs/pcrItemWorkflowContainer";
import {
  RenamePartnerSchema,
  renamePartnerErrorMap,
  renamePartnerSchema,
} from "@ui/pages/pcrs/renamePartner/renamePartner.zod";

import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { isNil } from "lodash";
import { PCRItemStatus } from "@framework/constants/pcrConstants";

export class PcrItemChangeRenamePartnerHandler extends ZodFormHandlerBase<
  RenamePartnerSchema,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrRenamePartnerStep],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: renamePartnerSchema,
      errorMap: renamePartnerErrorMap,
    };
  }

  protected async mapToZod({
    input,
    context,
  }: {
    input: AnyObject;
    context: IContext;
  }): Promise<z.input<RenamePartnerSchema>> {
    const partners = await context.runQuery(new GetAllForProjectQuery(input.projectId as ProjectId));

    return {
      form: input.form,
      partnerId: input.partnerId ?? null,
      accountName: input.accountName,
      markedAsComplete: input.markedAsComplete === "on",
      existingAccountName: partners.find(x => x.id === input.partnerId)?.name ?? "",
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<RenamePartnerSchema>;
    context: IContext;
    params: ProjectChangeRequestPrepareItemParams & { step?: number };
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
              accountName: input.accountName,
              partnerId: input.partnerId,
              ...(!isNil(params.step) ? { status: PCRItemStatus.Incomplete } : {}),
            },
          ],
        },
      }),
    );

    return PCRPrepareItemRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
      itemId: params.itemId,
      step: isNil(params.step) ? undefined : Number(params.step) + 1,
    }).path;
  }
}
