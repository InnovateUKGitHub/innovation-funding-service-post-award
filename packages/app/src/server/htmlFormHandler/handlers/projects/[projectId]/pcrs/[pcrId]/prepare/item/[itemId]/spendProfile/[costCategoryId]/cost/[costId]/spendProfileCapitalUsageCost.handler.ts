import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import {
  errorMap,
  CapitalUsageSchemaType,
  capitalUsageSchema,
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
import { PcrSpendProfileCapitalUsageTypeMapper } from "@framework/mappers/spendProfileTypeMapper";

export class PcrItemAddPartnerSpendProfileCapitalUsageCostsHandler extends ZodFormHandlerBase<
  CapitalUsageSchemaType,
  [PcrAddSpendProfileCostParams, PcrEditSpendProfileCostParams]
> {
  constructor() {
    super({
      routes: [PCRSpendProfileAddCostRoute, PCRSpendProfileEditCostRoute],
      forms: [FormTypes.PcrAddPartnerProjectCostCapitalUsage],
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
      costCategoryId: input.costCategoryId,
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
    const netCost = roundCurrency(
      (parseCurrency(input.netPresentValue) - parseCurrency(input.residualValue)) * (Number(input.utilisation) / 100),
    );

    const payload = {
      Acc_CostCategoryID__c: input.costCategoryId,
      Acc_ProjectChangeRequest__c: params.itemId,
      Acc_ItemDescription__c: input.capitalUsageDescription,
      Acc_NewOrExisting__c: new PcrSpendProfileCapitalUsageTypeMapper().mapToSalesforcePcrSpendProfileCapitalUsageType(
        input.itemType,
      ),
      Acc_DepreciationPeriod__c: input.depreciationPeriod,
      Acc_NetPresentValue__c: parseCurrency(input.netPresentValue),
      Acc_ResidualValue__c: parseCurrency(input.residualValue),
      Acc_Utilisation__c: input.utilisation,
      Acc_TotalCost__c: netCost,
    };

    if (input.id) {
      await context.repositories.pcrSpendProfile.updateSingleItem({
        Id: input.id,
        ...payload,
      });
    } else {
      await context.repositories.pcrSpendProfile.insertSingleItem(payload);
    }

    return PCRSpendProfileCostsSummaryRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
      itemId: params.itemId,
      costCategoryId: params.costCategoryId,
    }).path;
  }
}
