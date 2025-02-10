import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { errorMap, OverheadSchemaType, overheadSchema } from "@ui/pages/pcrs/addPartner/spendProfile/spendProfile.zod";
import {
  PcrAddSpendProfileCostParams,
  PcrEditSpendProfileCostParams,
  PCRSpendProfileAddCostRoute,
  PCRSpendProfileEditCostRoute,
} from "@ui/pages/pcrs/addPartner/spendProfile/spendProfilePrepareCost.page";
import { parseCurrency } from "@framework/util/numberHelper";
import { CostCategoryType } from "@framework/constants/enums";
import { PCRSpendProfileCostsSummaryRoute } from "@ui/pages/pcrs/addPartner/spendProfile/spendProfileCostsSummary.page";
import { PCRSpendProfileOverheadDocumentRoute } from "@ui/pages/pcrs/addPartner/spendProfile/overheadDocumentContainer.page";
import { PcrSpendProfileOverheadRateMapper } from "@framework/mappers/spendProfileOverheadMapper";

export class PcrItemAddPartnerSpendProfileOverheadCostsHandler extends ZodFormHandlerBase<
  OverheadSchemaType,
  [PcrAddSpendProfileCostParams, PcrEditSpendProfileCostParams]
> {
  constructor() {
    super({
      routes: [PCRSpendProfileAddCostRoute, PCRSpendProfileEditCostRoute],
      forms: [FormTypes.PcrAddPartnerProjectCostOverhead],
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
    const id = typeof input.id === "string" && input.id.trim().length > 0 ? input.id : null;

    return {
      id,
      form: input.form,
      costCategoryType: parseInt(input.costCategoryType) as CostCategoryType,
      overheadRate: input.overheadRate,
      calculatedValue: input.calculatedValue,
      button_submit: input.button_submit,
      costCategoryId: input.costCategoryId,
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
    if (input.button_submit === "uploadDocuments") {
      return PCRSpendProfileOverheadDocumentRoute.getLink({
        projectId: params.projectId,
        pcrId: params.pcrId,
        itemId: params.itemId,
        costCategoryId: params.costCategoryId,
      }).path;
    }
    const payload = {
      Acc_CostCategoryID__c: input.costCategoryId,
      Acc_ProjectChangeRequest__c: params.itemId,
      Acc_OverheadRate__c: new PcrSpendProfileOverheadRateMapper().mapToSalesforcePcrSpendProfileOverheadRateOption(
        input.overheadRate,
      ),
      Acc_TotalCost__c: parseCurrency(input.calculatedValue),
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
