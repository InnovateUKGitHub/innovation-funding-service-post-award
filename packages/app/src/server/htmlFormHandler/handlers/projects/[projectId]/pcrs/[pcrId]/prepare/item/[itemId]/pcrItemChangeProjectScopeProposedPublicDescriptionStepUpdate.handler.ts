import { PCRItemStatus, PCRItemType, PCRStepType } from "@framework/constants/pcrConstants";
import { PCRItemForScopeChangeDto } from "@framework/dtos/pcrDtos";
import { IContext } from "@framework/types/IContext";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { PCRPrepareItemRoute, ProjectChangeRequestPrepareItemParams } from "@ui/pages/pcrs/pcrItemWorkflowContainer";
import { PcrWorkflow } from "@ui/pages/pcrs/pcrWorkflow";
import {
  PcrScopeChangePublicDescriptionSchemaType,
  getPcrScopeChangePublicDescriptionSchema,
  scopeChangeErrorMap,
} from "@ui/pages/pcrs/scopeChange/scopeChange.zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

class ProjectChangeRequestItemChangeProjectScopeProposedPublicDescriptionStepUpdateHandler extends ZodFormHandlerBase<
  PcrScopeChangePublicDescriptionSchemaType,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrChangeProjectScopeProposedPublicDescriptionStepSaveAndContinue],
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
    input: z.input<PcrScopeChangePublicDescriptionSchemaType>;
  }) {
    const item = await this.getItem({
      context,
      projectId: input.projectId as ProjectId,
      pcrId: input.pcrId as PcrId,
      pcrItemId: input.pcrItemId as PcrItemId,
    });

    return {
      schema: getPcrScopeChangePublicDescriptionSchema(item?.status === PCRItemStatus.Complete),
      errorMap: scopeChangeErrorMap,
    };
  }

  protected async mapToZod({
    input,
  }: {
    input: AnyObject;
  }): Promise<z.input<PcrScopeChangePublicDescriptionSchemaType>> {
    return {
      form: input.form,
      projectId: input.projectId,
      pcrId: input.pcrId,
      pcrItemId: input.pcrItemId,
      publicDescription: input.publicDescription,
    };
  }

  protected async run({
    input,
    context,
  }: {
    input: z.output<PcrScopeChangePublicDescriptionSchemaType>;
    context: IContext;
  }): Promise<string> {
    const item = await this.getItem({
      context,
      projectId: input.projectId as ProjectId,
      pcrId: input.pcrId as PcrId,
      pcrItemId: input.pcrItemId as PcrItemId,
    });

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
              publicDescription: input.publicDescription,
            },
          ],
        },
      }),
    );

    const summaryWorkflow = PcrWorkflow.getWorkflow(item, undefined);
    const companiesHouseStep = summaryWorkflow?.findStepNumberByName(PCRStepType.publicDescriptionStep);
    const companiesHouseStepWorkflow = PcrWorkflow.getWorkflow(item, companiesHouseStep);
    const nextInfo = companiesHouseStepWorkflow?.getNextStepInfo();

    if (!nextInfo) throw new Error("Cannot find next workflow step to navigate to");

    return PCRPrepareItemRoute.getLink({
      projectId: input.projectId,
      pcrId: input.pcrId,
      itemId: input.pcrItemId,
      step: nextInfo.stepNumber,
    }).path;
  }
}

export { ProjectChangeRequestItemChangeProjectScopeProposedPublicDescriptionStepUpdateHandler };
