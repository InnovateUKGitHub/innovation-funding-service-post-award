import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { GetPcrSpendProfilesQuery } from "@server/features/pcrs/getPcrSpendProfiles";
import {
  errorMap,
  OverheadSchemaType,
  overheadSchema,
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

export class PcrItemAddPartnerSpendProfileOverheadCostsHandler extends ZodFormHandlerBase<
  OverheadSchemaType,
  [PcrAddSpendProfileCostParams, PcrEditSpendProfileCostParams]
> {
  constructor() {
    super({
      routes: [PCRSpendProfileAddCostRoute, PCRSpendProfileEditCostRoute],
      forms: [FormTypes.PcrAddPartnerSpendProfileOverheadCost],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: overheadSchema,
      errorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<OverheadSchemaType>> {
    return {
      id: input.id,
      form: input.form,
      costCategoryType: parseInt(input.costCategoryType) as CostCategoryType,
      overheadRate: input.overheadRate,
      calculatedValue: input.calculatedValue,
      button_submit: input.button_submit,
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<OverheadSchemaType>;
    context: IContext;
    params: PcrAddSpendProfileCostParams;
  }): Promise<string> {
    const spendProfile = await context.runQuery(new GetPcrSpendProfilesQuery(params.projectId, params.itemId));

    spendProfile.costs.push({
      description: "",
      costCategory: input.costCategoryType,
      id: input.id as CostId,
      costCategoryId: params.costCategoryId,
      overheadRate: Number(input.overheadRate),
      value:
        typeof input.calculatedValue === "string" && input.calculatedValue.trim().length > 0
          ? parseCurrency(input.calculatedValue)
          : 0,
    }),
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
