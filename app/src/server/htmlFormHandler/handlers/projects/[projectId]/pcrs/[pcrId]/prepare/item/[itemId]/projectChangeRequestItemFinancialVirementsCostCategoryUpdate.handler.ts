import { IContext } from "@framework/types/IContext";
import { GetClaimOverrideRates } from "@server/features/claims/getClaimOverrideRates";
import { UpdateFinancialVirementCommand } from "@server/features/financialVirements/updateFinancialVirementCommand";
import { GetAllForProjectQuery } from "@server/features/partners/getAllForProjectQuery";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import {
  mapOverwrittenFinancialVirements,
  patchFinancialVirementsForCosts,
} from "@ui/containers/pages/pcrs/financialVirements/edit/costCategory/CostCategoryLevelFinancialVirementEdit.logic";
import {
  PartnerLevelFinancialVirementParams,
  PartnerLevelFinancialVirementRoute,
} from "@ui/containers/pages/pcrs/financialVirements/edit/costCategory/CostCategoryLevelFinancialVirementEdit.page";
import {
  CostCategoryLevelFinancialVirementEditSchemaType,
  costCategoryLevelFinancialVirementEditErrorMap,
  getCostCategoryLevelFinancialVirementEditSchema,
} from "@ui/containers/pages/pcrs/financialVirements/edit/costCategory/CostCategoryLevelFinancialVirementEdit.zod";
import { PCRPrepareItemRoute } from "@ui/containers/pages/pcrs/pcrItemWorkflowContainer";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

class ProjectChangeRequestItemFinancialVirementsCostCategoryUpdate extends ZodFormHandlerBase<
  CostCategoryLevelFinancialVirementEditSchemaType,
  PartnerLevelFinancialVirementParams
> {
  constructor() {
    super({
      routes: [PartnerLevelFinancialVirementRoute],
      forms: [FormTypes.PcrFinancialVirementsCostCategorySaveAndContinue],
    });
  }

  public readonly acceptFiles = false;
  private static readonly MAX_NUMBER_COST_CATS = 50;

  protected async getZodSchema({
    input,
    context,
  }: {
    input: z.input<CostCategoryLevelFinancialVirementEditSchemaType>;
    context: IContext;
  }) {
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

    return {
      schema: getCostCategoryLevelFinancialVirementEditSchema({
        partners,
        financialVirementsForCosts: financialVirementsForParticipants.flatMap(x =>
          x.virements.map(y => ({ ...y, parentId: x.id })),
        ),
        financialVirementsForParticipants,
        claimOverrideAwardRates,
        pcrItemId: input.pcrItemId as PcrItemId,
      }),
      errorMap: costCategoryLevelFinancialVirementEditErrorMap,
    };
  }

  protected async mapToZod({
    input,
  }: {
    input: AnyObject;
  }): Promise<z.input<CostCategoryLevelFinancialVirementEditSchemaType>> {
    const virements: z.input<CostCategoryLevelFinancialVirementEditSchemaType>["virements"] = [];

    for (let i = 0; i < ProjectChangeRequestItemFinancialVirementsCostCategoryUpdate.MAX_NUMBER_COST_CATS; i++) {
      const virementCostId = input[`virements.${i}.virementCostId`];
      const newEligibleCosts = input[`virements.${i}.newEligibleCosts`];

      if (virementCostId && newEligibleCosts) {
        virements.push({ virementCostId, newEligibleCosts });
      } else {
        break;
      }
    }

    return {
      form: FormTypes.PcrFinancialVirementsCostCategorySaveAndContinue,
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
    input: z.output<CostCategoryLevelFinancialVirementEditSchemaType>;
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

export { ProjectChangeRequestItemFinancialVirementsCostCategoryUpdate };
