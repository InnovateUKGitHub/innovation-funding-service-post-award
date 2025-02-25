import { IContext } from "@framework/types/IContext";
import { GetClaimOverrideRates } from "@server/features/claims/getClaimOverrideRates";
import { GetAllForProjectQuery } from "@server/features/partners/getAllForProjectQuery";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import {
  PartnerLevelReallocateCostsParams,
  PartnerLevelReallocateCostsRoute,
} from "@ui/pages/pcrs/reallocateCosts/edit/costCategory/CostCategoryLevelReallocateCostsEdit.page";
import {
  CostCategoryLevelReallocateCostsEditSchemaType,
  costCategoryLevelReallocateCostsEditErrorMap,
  costCategoryLevelReallocateCostsEditSchema,
} from "@ui/pages/pcrs/reallocateCosts/edit/costCategory/CostCategoryLevelReallocateCostsEdit.zod";
import { PCRPrepareItemRoute } from "@ui/pages/pcrs/pcrItemWorkflowContainer";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { parseCurrency } from "@framework/util/numberHelper";

class ProjectChangeRequestItemReallocateCostsCostCategoryUpdate extends ZodFormHandlerBase<
  CostCategoryLevelReallocateCostsEditSchemaType,
  PartnerLevelReallocateCostsParams
> {
  constructor() {
    super({
      routes: [PartnerLevelReallocateCostsRoute],
      forms: [FormTypes.PcrReallocateCostsCostCategorySaveAndContinue],
    });
  }

  public readonly acceptFiles = false;
  private static readonly MAX_NUMBER_COST_CATS = 50;

  protected async getZodSchema() {
    return {
      schema: costCategoryLevelReallocateCostsEditSchema,
      errorMap: costCategoryLevelReallocateCostsEditErrorMap,
    };
  }

  protected async mapToZod({
    input,
    context,
    params,
  }: {
    input: AnyObject;
    context: IContext;
    params: PartnerLevelReallocateCostsParams;
  }): Promise<z.input<CostCategoryLevelReallocateCostsEditSchemaType>> {
    const virements: z.input<CostCategoryLevelReallocateCostsEditSchemaType>["virements"] = [];

    for (let i = 0; i < ProjectChangeRequestItemReallocateCostsCostCategoryUpdate.MAX_NUMBER_COST_CATS; i++) {
      const virementCostId = input[`virements.${i}.virementCostId`];
      const newEligibleCosts = input[`virements.${i}.newEligibleCosts`];
      const initialNewEligibleCosts = input[`virements.${i}.initialNewEligibleCosts`];

      if (virementCostId && newEligibleCosts) {
        virements.push({ virementCostId, newEligibleCosts, initialNewEligibleCosts });
      } else {
        break;
      }
    }

    const partnersPromise = context.runQuery(new GetAllForProjectQuery(params.projectId));
    const financialVirementsForParticipantsPromise = await context.repositories.financialVirements.getAllForPcr(
      params.itemId,
    );
    const claimOverrideAwardRatesPromise = context.runQuery(new GetClaimOverrideRates(input.partnerId as PartnerId));
    const projectChangeRequestPromise = context.runQuery(new GetPCRByIdQuery(params.projectId, params.pcrId));

    const [partners, financialVirementsForParticipants, claimOverrideAwardRates, pcr] = await Promise.all([
      partnersPromise,
      financialVirementsForParticipantsPromise,
      claimOverrideAwardRatesPromise,
      projectChangeRequestPromise,
    ]);

    const pcrItem = pcr.items.find(x => x.id === params.itemId);

    if (!pcrItem) throw new Error("cannae find pcr item");

    const financialVirements = {
      partners,
      financialVirementsForCosts: financialVirementsForParticipants
        .flatMap(x => x.virements.map(y => ({ ...y, parentId: x.id })))
        .map(x => ({ ...x, newEligibleCosts: x.newEligibleCosts ?? 0 })),
      financialVirementsForParticipants: financialVirementsForParticipants.map(x => ({
        ...x,
        newEligibleCosts: x.newEligibleCosts ?? 0,
        newRemainingGrant: x.newRemainingGrant ?? 0,
      })),
      claimOverrideAwardRates,
      pcrItemId: params.itemId,
    };

    return {
      form: FormTypes.PcrReallocateCostsCostCategorySaveAndContinue,
      partnerId: input.partnerId,
      virements,
      financialVirements,
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<CostCategoryLevelReallocateCostsEditSchemaType>;
    context: IContext;
    params: PartnerLevelReallocateCostsParams;
  }): Promise<string> {
    const updates = input.virements
      .filter(x => parseCurrency(x.newEligibleCosts) !== parseCurrency(x.initialNewEligibleCosts))
      .map(x => ({
        Id: x.virementCostId,
        Acc_NewCosts__c: parseCurrency(x.newEligibleCosts),
      }));
    if (updates.length) {
      await context.repositories.financialVirements.updateVirements(updates);
    }

    return PCRPrepareItemRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
      itemId: params.itemId,
    }).path;
  }
}

export { ProjectChangeRequestItemReallocateCostsCostCategoryUpdate };
