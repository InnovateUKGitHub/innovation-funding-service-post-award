import { IContext } from "@framework/types/IContext";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { GetAllForProjectQuery } from "@server/features/partners/getAllForProjectQuery";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import {
  PCRPrepareItemRoute,
  ProjectChangeRequestPrepareItemParams,
} from "@ui/containers/pages/pcrs/pcrItemWorkflowContainer";
import {
  RenamePartnerSchema,
  getRenamePartnerSchema,
  renamePartnerErrorMap,
} from "@ui/containers/pages/pcrs/renamePartner/renamePartner.zod";

import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

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

  protected async getZodSchema({ context, input }: { context: IContext; input: z.input<RenamePartnerSchema> }) {
    const partners = await context.runQuery(new GetAllForProjectQuery(input.projectId as ProjectId));

    return {
      schema: getRenamePartnerSchema(partners),
      errorMap: renamePartnerErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<RenamePartnerSchema>> {
    return {
      form: input.form,
      projectId: input.projectId,
      pcrId: input.pcrId,
      pcrItemId: input.pcrItemId,
      partnerId: input.partnerId,
      accountName: input.accountName,
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
            },
          ],
        },
      }),
    );

    return PCRPrepareItemRoute.getLink({
      projectId: input.projectId,
      pcrId: input.pcrId,
      itemId: input.pcrItemId,
      step: undefined,
    }).path;
  }
}
