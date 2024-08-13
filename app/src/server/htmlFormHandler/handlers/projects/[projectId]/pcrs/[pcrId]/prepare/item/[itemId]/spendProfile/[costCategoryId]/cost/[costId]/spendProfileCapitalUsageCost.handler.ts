import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { GetPcrSpendProfilesQuery } from "@server/features/pcrs/getPcrSpendProfiles";
import {
  errorMap,
  CapitalUsageSchemaType,
  capitalUsageSchema,
} from "@ui/containers/pages/pcrs/addPartner/spendProfile/spendProfile.zod";
import {
  PcrAddSpendProfileCostParams,
  PcrEditSpendProfileCostParams,
  PCRSpendProfileAddCostRoute,
  PCRSpendProfileEditCostRoute,
} from "@ui/containers/pages/pcrs/addPartner/spendProfile/spendProfilePrepareCost.page";
import { parseCurrency } from "@framework/util/numberHelper";
import { CostCategoryType } from "@framework/constants/enums";
import { PCRSpendProfileCostsSummaryRoute } from "@ui/containers/pages/pcrs/addPartner/spendProfile/spendProfileCostsSummary.page";
import { updatePcrItem } from "../../../../addPartnerUtils";

export class PcrItemAddPartnerSpendProfileCapitalUsageCostsHandler extends ZodFormHandlerBase<
  CapitalUsageSchemaType,
  [PcrAddSpendProfileCostParams, PcrEditSpendProfileCostParams]
> {
  constructor() {
    super({
      routes: [PCRSpendProfileAddCostRoute, PCRSpendProfileEditCostRoute],
      forms: [FormTypes.PcrAddPartnerSpendProfileCapitalUsageCost],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: capitalUsageSchema,
      errorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<CapitalUsageSchemaType>> {
    const id = typeof input.id === "string" && input.id.trim().length > 0 ? input.id : null;

    return {
      id,
      form: input.form,
      costCategoryType: parseInt(input.costCategoryType) as CostCategoryType,
      capitalUsageDescription: input.capitalUsageDescription,
      depreciationPeriod: input.depreciationPeriod,
      itemType: input.itemType,
      netPresentValue: input.netPresentValue,
      residualValue: input.residualValue,
      utilisation: input.utilisation,
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<CapitalUsageSchemaType>;
    context: IContext;
    params: PcrAddSpendProfileCostParams;
  }): Promise<string> {
    const spendProfile = await context.runQuery(new GetPcrSpendProfilesQuery(params.projectId, params.itemId));
    const netCost =
      (parseCurrency(input.netPresentValue) - parseCurrency(input.residualValue)) * (Number(input.utilisation) / 100);
    spendProfile.costs.push({
      costCategory: input.costCategoryType,
      id: input.id as CostId,
      costCategoryId: params.costCategoryId,
      description: input.capitalUsageDescription,
      type: Number(input.itemType),
      depreciationPeriod: Number(input.depreciationPeriod),
      netPresentValue: parseCurrency(input.netPresentValue),
      residualValue: parseCurrency(input.residualValue),
      utilisation: Number(input.utilisation),
      value: netCost,
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
