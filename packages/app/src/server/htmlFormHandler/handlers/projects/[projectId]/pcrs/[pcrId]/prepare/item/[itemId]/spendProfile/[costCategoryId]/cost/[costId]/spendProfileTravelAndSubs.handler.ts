import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { GetPcrSpendProfilesQuery } from "@server/features/pcrs/getPcrSpendProfiles";
import {
  errorMap,
  TravelAndSubsistenceSchemaType,
  travelAndASubsistenceSchema,
} from "@ui/pages/pcrs/addPartner/spendProfile/spendProfile.zod";
import {
  PcrAddSpendProfileCostParams,
  PcrEditSpendProfileCostParams,
  PCRSpendProfileAddCostRoute,
  PCRSpendProfileEditCostRoute,
} from "@ui/pages/pcrs/addPartner/spendProfile/spendProfilePrepareCost.page";
import { parseCurrency } from "@framework/util/numberHelper";
import { CostCategoryType } from "@framework/constants/enums";
import { PCRSpendProfileCostsSummaryRoute } from "@ui/pages/pcrs/addPartner/spendProfile/spendProfileCostsSummary.page";
import { updatePcrItem } from "../../../../addPartnerUtils";

export class PcrItemAddPartnerSpendProfileTravelAndSubsCostsHandler extends ZodFormHandlerBase<
  TravelAndSubsistenceSchemaType,
  [PcrAddSpendProfileCostParams, PcrEditSpendProfileCostParams]
> {
  constructor() {
    super({
      routes: [PCRSpendProfileAddCostRoute, PCRSpendProfileEditCostRoute],
      forms: [FormTypes.PcrAddPartnerSpendProfileTravelAndSubsistenceCost],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: travelAndASubsistenceSchema,
      errorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<TravelAndSubsistenceSchemaType>> {
    const id = typeof input.id === "string" && input.id.trim().length > 0 ? input.id : null;
    const totalCost = parseInt(input.numberOfTimes) * parseCurrency(input.costOfEach);
    return {
      id,
      form: input.form,
      costCategoryType: parseInt(input.costCategoryType) as CostCategoryType,
      descriptionOfCost: input.descriptionOfCost,
      numberOfTimes: input.numberOfTimes,
      costOfEach: input.costOfEach,
      totalCost,
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<TravelAndSubsistenceSchemaType>;
    context: IContext;
    params: PcrAddSpendProfileCostParams;
  }): Promise<string> {
    const spendProfile = await context.runQuery(new GetPcrSpendProfilesQuery(params.projectId, params.itemId));

    const totalCost = Number(input.numberOfTimes ?? 0) * parseCurrency(input.costOfEach ?? 0);
    spendProfile.costs.push({
      costCategory: input.costCategoryType,
      id: input.id as CostId,
      costCategoryId: params.costCategoryId,
      description: input.descriptionOfCost,
      numberOfTimes: Number(input.numberOfTimes),
      costOfEach: parseCurrency(input.costOfEach),
      value: totalCost,
    });

    await updatePcrItem({
      params,
      context,
      data: {
        spendProfile,
      },
    });

    return PCRSpendProfileCostsSummaryRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
      itemId: params.itemId,
      costCategoryId: params.costCategoryId,
    }).path;
  }
}
