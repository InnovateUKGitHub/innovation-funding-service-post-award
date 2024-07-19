import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { GetPcrSpendProfilesQuery } from "@server/features/pcrs/getPcrSpendProfiles";
import {
  errorMap,
  MaterialsSchemaType,
  materialsSchema,
} from "@ui/containers/pages/pcrs/addPartner/spendProfile/spendProfile.zod";
import {
  PcrAddSpendProfileCostParams,
  PCRSpendProfileAddCostRoute,
} from "@ui/containers/pages/pcrs/addPartner/spendProfile/spendProfilePrepareCost.page";
import { parseCurrency } from "@framework/util/numberHelper";
import { CostCategoryType } from "@framework/constants/enums";
import { PCRSpendProfileCostsSummaryRoute } from "@ui/containers/pages/pcrs/addPartner/spendProfile/spendProfileCostsSummary.page";
import { updatePcrItem } from "../../../../addPartnerUtils";

export class PcrItemAddPartnerSpendProfileMaterialsCostsHandler extends ZodFormHandlerBase<
  MaterialsSchemaType,
  PcrAddSpendProfileCostParams
> {
  constructor() {
    super({
      routes: [PCRSpendProfileAddCostRoute],
      forms: [FormTypes.PcrAddPartnerSpendProfileMaterialsCost],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: materialsSchema,
      errorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<MaterialsSchemaType>> {
    return {
      id: input.id,
      form: input.form,
      costCategoryType: parseInt(input.costCategoryType) as CostCategoryType,
      materialsDescription: input.materialsDescription,
      quantityOfMaterialItems: input.quantityOfMaterialItems,
      costPerItem: input.costPerItem,
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<MaterialsSchemaType>;
    context: IContext;
    params: PcrAddSpendProfileCostParams;
  }): Promise<string> {
    const spendProfile = await context.runQuery(new GetPcrSpendProfilesQuery(params.projectId, params.itemId));

    spendProfile.costs.push({
      costCategory: input.costCategoryType,
      id: input.id as CostId,
      costCategoryId: params.costCategoryId,
      description: input.materialsDescription,
      quantity: Number(input.quantityOfMaterialItems),
      costPerItem: parseCurrency(input.costPerItem),
      value: parseCurrency(input.costPerItem) * Number(input.quantityOfMaterialItems),
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
