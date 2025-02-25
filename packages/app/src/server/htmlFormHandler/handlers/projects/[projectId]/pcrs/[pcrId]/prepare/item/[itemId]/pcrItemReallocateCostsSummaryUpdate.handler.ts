import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { IContext } from "@framework/types/IContext";
import { GetAllForProjectQuery } from "@server/features/partners/getAllForProjectQuery";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import {
  ReallocateCostsSummaryValidatorSchema,
  reallocateCostsSummaryErrorMap,
  reallocateCostsSummaryValidator,
} from "@ui/pages/pcrs/reallocateCosts/summary/ReallocateCostsSummary.zod";
import { ProjectChangeRequestPrepareRoute } from "@ui/pages/pcrs/overview/projectChangeRequestPrepare.page";
import { PCRPrepareItemRoute, ProjectChangeRequestPrepareItemParams } from "@ui/pages/pcrs/pcrItemWorkflowContainer";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";
import { parseCurrency } from "@framework/util/numberHelper";

class ProjectChangeRequestItemReallocateCostsSummaryUpdate extends ZodFormHandlerBase<
  ReallocateCostsSummaryValidatorSchema,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrReallocateCostsSummary],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: reallocateCostsSummaryValidator,
      errorMap: reallocateCostsSummaryErrorMap,
    };
  }

  protected async mapToZod({
    context,
    input,
    params,
  }: {
    input: AnyObject;
    context: IContext;
    params: ProjectChangeRequestPrepareItemParams;
  }): Promise<z.input<ReallocateCostsSummaryValidatorSchema>> {
    const partnersPromise = context.runQuery(new GetAllForProjectQuery(params.projectId));
    const financialVirementsForParticipantsPromise = await context.repositories.financialVirements.getAllForPcr(
      params.itemId,
    );
    const projectChangeRequestPromise = context.runQuery(new GetPCRByIdQuery(params.projectId, params.pcrId));

    const [partners, financialVirementsForParticipants, pcr] = await Promise.all([
      partnersPromise,
      financialVirementsForParticipantsPromise,
      projectChangeRequestPromise,
    ]);

    const pcrItem = pcr.items.find(x => x.id === params.itemId);

    if (!pcrItem) throw new Error("cannae find pcr item");

    return {
      form: FormTypes.PcrReallocateCostsSummary,
      financialVirements: {
        partners,
        financialVirementsForCosts: financialVirementsForParticipants.flatMap(x => x.virements),
        financialVirementsForParticipants,
        pcrItemId: params.itemId,
      },
      grantMovingOverFinancialYear: input.grantMovingOverFinancialYear,
      markedAsComplete: input.markedAsComplete === "on",
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<ReallocateCostsSummaryValidatorSchema>;
    context: IContext;
    params: ProjectChangeRequestPrepareItemParams;
  }): Promise<string> {
    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: params.itemId,
      Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(
        input.markedAsComplete ? PCRItemStatus.Complete : PCRItemStatus.Incomplete,
      ),
      Acc_GrantMovingOverFinancialYear__c: parseCurrency(input.grantMovingOverFinancialYear),
    });

    return ProjectChangeRequestPrepareRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
    }).path;
  }
}

export { ProjectChangeRequestItemReallocateCostsSummaryUpdate };
