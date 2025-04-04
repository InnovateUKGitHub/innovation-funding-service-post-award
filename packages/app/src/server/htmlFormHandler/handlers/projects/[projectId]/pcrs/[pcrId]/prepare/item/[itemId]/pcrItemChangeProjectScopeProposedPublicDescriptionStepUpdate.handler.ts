import { PCRItemStatus, PCRItemType, PCRStepType } from "@framework/constants/pcrConstants";
import { PCRItemForScopeChangeDto } from "@framework/dtos/pcrDtos";
import { IContext } from "@framework/types/IContext";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";
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
      publicDescription: input.publicDescription,
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<PcrScopeChangePublicDescriptionSchemaType>;
    context: IContext;
    params: ProjectChangeRequestPrepareItemParams;
  }): Promise<string> {
    const item = await this.getItem({
      context,
      projectId: params.projectId,
      pcrId: params.pcrId,
      pcrItemId: params.itemId,
    });

    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: params.itemId,
      Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(PCRItemStatus.Incomplete),
      Acc_NewPublicDescription__c: input?.publicDescription ?? null,
    });

    const summaryWorkflow = PcrWorkflow.getWorkflow(item, undefined);
    const companiesHouseStep = summaryWorkflow?.findStepNumberByName(PCRStepType.publicDescriptionStep);
    const companiesHouseStepWorkflow = PcrWorkflow.getWorkflow(item, companiesHouseStep);
    const nextInfo = companiesHouseStepWorkflow?.getNextStepInfo();

    if (!nextInfo) throw new Error("Cannot find next workflow step to navigate to");

    return PCRPrepareItemRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
      itemId: params.itemId,
      step: nextInfo.stepNumber,
    }).path;
  }
}

export { ProjectChangeRequestItemChangeProjectScopeProposedPublicDescriptionStepUpdateHandler };
