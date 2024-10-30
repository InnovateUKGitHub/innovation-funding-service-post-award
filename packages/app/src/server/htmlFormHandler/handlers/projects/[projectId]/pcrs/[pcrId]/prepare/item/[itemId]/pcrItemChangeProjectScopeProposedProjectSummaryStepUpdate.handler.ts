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
    input,
  }: {
    context: IContext;
    input: z.input<PcrScopeChangeProjectSummarySchemaType>;
  }) {
    const item = await this.getItem({
      context,
      projectId: input.projectId as ProjectId,
      pcrId: input.pcrId as PcrId,
      pcrItemId: input.pcrItemId as PcrItemId,
    });

    return {
      schema: getPcrScopeChangeProjectSummarySchema(item?.status === PCRItemStatus.Complete),
      errorMap: scopeChangeErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<PcrScopeChangeProjectSummarySchemaType>> {
    return {
      form: input.form,
      projectId: input.projectId,
      pcrId: input.pcrId,
      pcrItemId: input.pcrItemId,
      projectSummary: input.projectSummary,
    };
  }

  protected async run({
    input,
    context,
  }: {
    input: z.output<PcrScopeChangeProjectSummarySchemaType>;
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
              projectSummary: input.projectSummary,
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

export { ProjectChangeRequestItemChangeProjectScopeProposedProjectSummaryStepUpdateHandler };
