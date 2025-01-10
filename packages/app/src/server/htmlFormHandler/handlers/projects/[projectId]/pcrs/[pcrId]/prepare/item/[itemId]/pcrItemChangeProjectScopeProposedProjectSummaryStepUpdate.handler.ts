import { PCRItemStatus, PCRItemType } from "@framework/constants/pcrConstants";
import { PCRItemForScopeChangeDto } from "@framework/dtos/pcrDtos";
import { IContext } from "@framework/types/IContext";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { PCRPrepareItemRoute, ProjectChangeRequestPrepareItemParams } from "@ui/pages/pcrs/pcrItemWorkflowContainer";
import {
  PcrScopeChangeProjectSummarySchemaType,
  getPcrScopeChangeProjectSummarySchema,
  scopeChangeErrorMap,
} from "@ui/pages/pcrs/scopeChange/scopeChange.zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

class ProjectChangeRequestItemChangeProjectScopeProposedProjectSummaryStepUpdateHandler extends ZodFormHandlerBase<
  PcrScopeChangeProjectSummarySchemaType,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrChangeProjectScopeProposedProjectSummaryStepSaveAndContinue],
    });
  }

  public readonly acceptFiles = false;

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
    const item = pcr.items.find(x => x.id === pcrItemId && x.type === PCRItemType.ScopeChange);
    if (!item) throw new Error("Cannot find PCR item ID");
    return item as PCRItemForScopeChangeDto;
  }

  protected async getZodSchema({
    context,
    params,
  }: {
    context: IContext;
    params: ProjectChangeRequestPrepareItemParams;
  }) {
    const item = await this.getItem({
      context,
      projectId: params.projectId,
      pcrId: params.pcrId,
      pcrItemId: params.itemId,
    });

    return {
      schema: getPcrScopeChangeProjectSummarySchema(item?.status === PCRItemStatus.Complete),
      errorMap: scopeChangeErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<PcrScopeChangeProjectSummarySchemaType>> {
    return {
      form: input.form,
      projectSummary: input.projectSummary,
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<PcrScopeChangeProjectSummarySchemaType>;
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
              projectSummary: input.projectSummary,
            },
          ],
        },
      }),
    );

    return PCRPrepareItemRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
      itemId: params.itemId,
      step: undefined,
    }).path;
  }
}

export { ProjectChangeRequestItemChangeProjectScopeProposedProjectSummaryStepUpdateHandler };
