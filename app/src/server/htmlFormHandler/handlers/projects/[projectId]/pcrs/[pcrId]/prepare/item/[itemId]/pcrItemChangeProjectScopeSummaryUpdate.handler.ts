import { PCRItemStatus, PCRItemType } from "@framework/constants/pcrConstants";
import { PCRItemForScopeChangeDto } from "@framework/dtos/pcrDtos";
import { IContext } from "@framework/types/IContext";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { ProjectChangeRequestPrepareRoute } from "@ui/pages/pcrs/overview/projectChangeRequestPrepare.page";
import { PCRPrepareItemRoute, ProjectChangeRequestPrepareItemParams } from "@ui/pages/pcrs/pcrItemWorkflowContainer";
import {
  PcrScopeChangeSchemaType,
  pcrScopeChangeSchema,
  scopeChangeErrorMap,
} from "@ui/pages/pcrs/scopeChange/scopeChange.zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

class ProjectChangeRequestItemChangeProjectScopeSummaryUpdateHandler extends ZodFormHandlerBase<
  PcrScopeChangeSchemaType,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrChangeProjectScopeSummary],
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

  protected async getZodSchema() {
    return {
      schema: pcrScopeChangeSchema,
      errorMap: scopeChangeErrorMap,
    };
  }

  protected async mapToZod({
    input,
    context,
  }: {
    input: AnyObject;
    context: IContext;
  }): Promise<z.input<PcrScopeChangeSchemaType>> {
    const item = await this.getItem({
      context,
      projectId: input.projectId as ProjectId,
      pcrId: input.pcrId as PcrId,
      pcrItemId: input.pcrItemId as PcrItemId,
    });

    return {
      form: FormTypes.PcrChangeProjectScopeSummary,
      projectId: input.projectId,
      pcrId: input.pcrId,
      pcrItemId: input.pcrItemId,
      markedAsComplete: input.markedAsComplete === "on",
      projectSummary: item.projectSummary ?? "",
      publicDescription: item.publicDescription ?? "",
    };
  }

  protected async run({
    input,
    context,
  }: {
    input: z.output<PcrScopeChangeSchemaType>;
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

export { ProjectChangeRequestItemChangeProjectScopeSummaryUpdateHandler };
