import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
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
import { parseCurrency, roundCurrency } from "@framework/util/numberHelper";
import { CostCategoryType } from "@framework/constants/enums";
import { PCRSpendProfileCostsSummaryRoute } from "@ui/pages/pcrs/addPartner/spendProfile/spendProfileCostsSummary.page";

export class PcrItemAddPartnerSpendProfileTravelAndSubsCostsHandler extends ZodFormHandlerBase<
  TravelAndSubsistenceSchemaType,
  [PcrAddSpendProfileCostParams, PcrEditSpendProfileCostParams]
> {
  constructor() {
    super({
      routes: [PCRSpendProfileAddCostRoute, PCRSpendProfileEditCostRoute],
      forms: [FormTypes.PcrAddPartnerProjectCostTravelAndSubsistence],
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
      costCategoryId: input.costCategoryId,
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
    const payload = {
      Acc_CostCategoryID__c: input.costCategoryId,
      Acc_ProjectChangeRequest__c: params.itemId,
      Acc_ItemDescription__c: input.descriptionOfCost,
      Acc_NumberOfTimes__c: input.numberOfTimes,
      Acc_CostEach__c: parseCurrency(input.costOfEach),
      Acc_TotalCost__c: roundCurrency(parseCurrency(input.costOfEach) * input.numberOfTimes),
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
