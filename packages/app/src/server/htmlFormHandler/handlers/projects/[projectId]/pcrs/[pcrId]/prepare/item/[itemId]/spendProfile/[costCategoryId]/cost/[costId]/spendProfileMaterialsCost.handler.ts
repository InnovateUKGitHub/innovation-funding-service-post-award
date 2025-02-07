import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import {
  errorMap,
  MaterialsSchemaType,
  materialsSchema,
} from "@ui/pages/pcrs/addPartner/spendProfile/spendProfile.zod";
import {
  PcrAddSpendProfileCostParams,
  PcrEditSpendProfileCostParams,
  PCRSpendProfileAddCostRoute,
  PCRSpendProfileEditCostRoute,
} from "@ui/pages/pcrs/addPartner/spendProfile/spendProfilePrepareCost.page";
import { parseCurrency, roundCurrency } from "@framework/util/numberHelper";
import { CostCategoryType } from "@framework/constants/enums";
import { PCRSpendProfileCostsSummaryRoute } from "@ui/pages/pcrs/addPartner/spendProfile/spendProfileCostsSummary.page";

export class PcrItemAddPartnerSpendProfileMaterialsCostsHandler extends ZodFormHandlerBase<
  MaterialsSchemaType,
  [PcrAddSpendProfileCostParams, PcrEditSpendProfileCostParams]
> {
  constructor() {
    super({
      routes: [PCRSpendProfileAddCostRoute, PCRSpendProfileEditCostRoute],
      forms: [FormTypes.PcrAddPartnerProjectCostMaterials],
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
    const id = typeof input.id === "string" && input.id.trim().length > 0 ? input.id : null;

    return {
      id,
      form: input.form,
      costCategoryType: parseInt(input.costCategoryType) as CostCategoryType,
      materialsDescription: input.materialsDescription,
      quantityOfMaterialItems: input.quantityOfMaterialItems,
      costPerItem: input.costPerItem,
      costCategoryId: input.costCategoryId,
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<MaterialsSchemaType>;
    context: IContext;
    params: PcrAddSpendProfileCostParams | PcrEditSpendProfileCostParams;
  }): Promise<string> {
    const payload = {
      Acc_CostCategoryID__c: input.costCategoryId,
      Acc_ProjectChangeRequest__c: params.itemId,
      Acc_ItemDescription__c: input.materialsDescription,
      Acc_CostPerItem__c: parseCurrency(input.costPerItem),
      Acc_Quantity__c: input.quantityOfMaterialItems,
      Acc_TotalCost__c: roundCurrency(parseCurrency(input.costPerItem) * input.quantityOfMaterialItems),
    };

    if (input.id) {
      context.repositories.pcrSpendProfile.updateSingleItem({
        Id: input.id,
        ...payload,
      });
    } else {
      context.repositories.pcrSpendProfile.insertSingleItem(payload);
    }

    return PCRSpendProfileCostsSummaryRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
      itemId: params.itemId,
      costCategoryId: params.costCategoryId,
    }).path;
  }
}
