import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import {
  errorMap,
  OtherCostsSchemaType,
  otherCostsSchema,
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

export class PcrItemAddPartnerSpendProfileOtherCostsHandler extends ZodFormHandlerBase<
  OtherCostsSchemaType,
  [PcrAddSpendProfileCostParams, PcrEditSpendProfileCostParams]
> {
  constructor() {
    super({
      routes: [PCRSpendProfileAddCostRoute, PCRSpendProfileEditCostRoute],
      forms: [FormTypes.PcrAddPartnerProjectCostOtherCost],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: otherCostsSchema,
      errorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<OtherCostsSchemaType>> {
    const id = typeof input.id === "string" && input.id.trim().length > 0 ? input.id : null;

    return {
      id,
      form: input.form,
      costCategoryType: parseInt(input.costCategoryType) as CostCategoryType,
      otherCostDescription: input.otherCostDescription,
      estimatedCost: input.estimatedCost,
      costCategoryId: input.costCategoryId,
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<OtherCostsSchemaType>;
    context: IContext;
    params: PcrAddSpendProfileCostParams;
  }): Promise<string> {
    if (input.id) {
      await context.repositories.pcrSpendProfile.updateSingleItem({
        Id: input.id,
        Acc_CostCategoryID__c: input.costCategoryId,
        Acc_ProjectChangeRequest__c: params.itemId,
        Acc_ItemDescription__c: input.otherCostDescription,
        Acc_TotalCost__c: parseCurrency(input.estimatedCost),
      });
    } else {
      await context.repositories.pcrSpendProfile.insertSingleItem({
        Acc_CostCategoryID__c: input.costCategoryId,
        Acc_ProjectChangeRequest__c: params.itemId,
        Acc_ItemDescription__c: input.otherCostDescription,
        Acc_TotalCost__c: parseCurrency(input.estimatedCost),
      });
    }

    return PCRSpendProfileCostsSummaryRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
      itemId: params.itemId,
      costCategoryId: params.costCategoryId,
    }).path;
  }
}
