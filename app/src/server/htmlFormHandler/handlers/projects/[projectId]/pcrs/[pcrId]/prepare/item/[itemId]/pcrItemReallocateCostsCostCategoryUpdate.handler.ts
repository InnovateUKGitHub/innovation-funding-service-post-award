import { IContext } from "@framework/types/IContext";
import { GetClaimOverrideRates } from "@server/features/claims/getClaimOverrideRates";
import { UpdateFinancialVirementCommand } from "@server/features/financialVirements/updateFinancialVirementCommand";
import { GetAllForProjectQuery } from "@server/features/partners/getAllForProjectQuery";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import {
  mapOverwrittenFinancialVirements,
  patchFinancialVirementsForCosts,
} from "@ui/containers/pages/pcrs/reallocateCosts/edit/costCategory/CostCategoryLevelReallocateCostsEdit.logic";
import {
  PartnerLevelReallocateCostsParams,
  PartnerLevelReallocateCostsRoute,
} from "@ui/containers/pages/pcrs/reallocateCosts/edit/costCategory/CostCategoryLevelReallocateCostsEdit.page";
import {
  CostCategoryLevelReallocateCostsEditSchemaType,
  costCategoryLevelReallocateCostsEditErrorMap,
  getCostCategoryLevelReallocateCostsEditSchema,
} from "@ui/containers/pages/pcrs/reallocateCosts/edit/costCategory/CostCategoryLevelReallocateCostsEdit.zod";
import { PCRPrepareItemRoute } from "@ui/containers/pages/pcrs/pcrItemWorkflowContainer";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

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

  protected async getZodSchema({
    input,
    context,
  }: {
    input: z.input<CostCategoryLevelReallocateCostsEditSchemaType>;
    context: IContext;
  }) {
    const partnersPromise = context.runQuery(new GetAllForProjectQuery(input.projectId as ProjectId));
    const financialVirementsForParticipantsPromise = await context.repositories.financialVirements.getAllForPcr(
      input.pcrItemId as PcrItemId,
    );
    const claimOverrideAwardRatesPromise = context.runQuery(new GetClaimOverrideRates(input.partnerId as PartnerId));
    const projectChangeRequestPromise = context.runQuery(
      new GetPCRByIdQuery(input.projectId as ProjectId, input.pcrId as PcrId),
    );

    const [partners, financialVirementsForParticipants, claimOverrideAwardRates, pcr] = await Promise.all([
      partnersPromise,
      financialVirementsForParticipantsPromise,
      claimOverrideAwardRatesPromise,
      projectChangeRequestPromise,
    ]);

    const pcrItem = pcr.items.find(x => x.id === input.pcrItemId);

    if (!pcrItem) throw new Error("cannae find pcr item");

    return {
      schema: getCostCategoryLevelReallocateCostsEditSchema({
        mapReallocateCostsProps: {
          partners,
          financialVirementsForCosts: financialVirementsForParticipants.flatMap(x =>
            x.virements.map(y => ({ ...y, parentId: x.id })),
          ),
          financialVirementsForParticipants,
          claimOverrideAwardRates,
          pcrItemId: input.pcrItemId as PcrItemId,
        },
      }),
      errorMap: costCategoryLevelReallocateCostsEditErrorMap,
    };
  }

  protected async mapToZod({
    input,
  }: {
    input: AnyObject;
  }): Promise<z.input<CostCategoryLevelReallocateCostsEditSchemaType>> {
    const virements: z.input<CostCategoryLevelReallocateCostsEditSchemaType>["virements"] = [];

    for (let i = 0; i < ProjectChangeRequestItemReallocateCostsCostCategoryUpdate.MAX_NUMBER_COST_CATS; i++) {
      const virementCostId = input[`virements.${i}.virementCostId`];
      const newEligibleCosts = input[`virements.${i}.newEligibleCosts`];

      if (virementCostId && newEligibleCosts) {
        virements.push({ virementCostId, newEligibleCosts });
      } else {
        break;
      }
    }

    return {
      form: FormTypes.PcrReallocateCostsCostCategorySaveAndContinue,
      projectId: input.projectId,
      pcrId: input.pcrId,
      pcrItemId: input.pcrItemId,
      partnerId: input.partnerId,
      virements,
    };
  }

  protected async run({
    input,
    context,
  }: {
    input: z.output<CostCategoryLevelReallocateCostsEditSchemaType>;
    context: IContext;
  }): Promise<string> {
    const partnersPromise = context.runQuery(new GetAllForProjectQuery(input.projectId as ProjectId));
    const financialVirementsForParticipantsPromise = await context.repositories.financialVirements.getAllForPcr(
      input.pcrItemId as PcrItemId,
    );
    const claimOverrideAwardRatesPromise = context.runQuery(new GetClaimOverrideRates(input.partnerId as PartnerId));
    const [partners, financialVirementsForParticipants, claimOverrideAwardRates] = await Promise.all([
      partnersPromise,
      financialVirementsForParticipantsPromise,
      claimOverrideAwardRatesPromise,
    ]);

    const dto = mapOverwrittenFinancialVirements({
      partners,
      financialVirementsForCosts: patchFinancialVirementsForCosts(
        financialVirementsForParticipants.flatMap(x => x.virements),
        input.virements,
      ),
      financialVirementsForParticipants,
      claimOverrideAwardRates,
      pcrItemId: input.pcrItemId as PcrItemId,
    })(input.virements);

    await context.runCommand(
      new UpdateFinancialVirementCommand(input.projectId, input.pcrId, input.pcrItemId, dto.virementData, true),
    );

    return PCRPrepareItemRoute.getLink({
      projectId: input.projectId,
      pcrId: input.pcrId,
      itemId: input.pcrItemId,
    }).path;
  }
}

export { ProjectChangeRequestItemReallocateCostsCostCategoryUpdate };
