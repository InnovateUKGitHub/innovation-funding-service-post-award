import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { labourSchema, LabourSchemaType, errorMap } from "@ui/pages/pcrs/addPartner/spendProfile/spendProfile.zod";
import {
  PcrAddSpendProfileCostParams,
  PcrEditSpendProfileCostParams,
  PCRSpendProfileAddCostRoute,
  PCRSpendProfileEditCostRoute,
} from "@ui/pages/pcrs/addPartner/spendProfile/spendProfilePrepareCost.page";
import { parseCurrency, roundCurrency } from "@framework/util/numberHelper";
import { CostCategoryType } from "@framework/constants/enums";
import { PCRSpendProfileCostsSummaryRoute } from "@ui/pages/pcrs/addPartner/spendProfile/spendProfileCostsSummary.page";
import { set, sumBy } from "lodash";

export class PcrItemAddPartnerSpendProfileLabourCostsHandler extends ZodFormHandlerBase<
  LabourSchemaType,
  [PcrAddSpendProfileCostParams, PcrEditSpendProfileCostParams]
> {
  constructor() {
    super({
      routes: [PCRSpendProfileAddCostRoute, PCRSpendProfileEditCostRoute],
      forms: [FormTypes.PcrAddPartnerProjectCostLabour],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: labourSchema,
      errorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<LabourSchemaType>> {
    const id = typeof input.id === "string" && input.id.trim().length > 0 ? input.id : null;
    const data = { labourProfile: [] };
    Object.values(input).reduce((acc, cur) => {
      if (/labourProfile/.test(cur[0])) {
        set(data, [cur[0]], parseCurrency(cur[1]));
      }
    }, []);

    return {
      id,
      form: input.form,
      labourDescription: input.labourDescription,
      grossCostOfRole: input.grossCostOfRole,
      ratePerDay: input.ratePerDay,
      daysSpentOnProject: input.daysSpentOnProject,
      costCategoryType: parseInt(input.costCategoryType) as CostCategoryType,
      costCategoryId: input.costCategoryId,
      overheadCostId: input.overheadCostId,
      labourProfile: data.labourProfile,
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<LabourSchemaType>;
    context: IContext;
    params: PcrAddSpendProfileCostParams | PcrEditSpendProfileCostParams;
  }): Promise<string> {
    const totalCost = roundCurrency(parseCurrency(input.ratePerDay) * input.daysSpentOnProject);

    /**
     * need to recalculate overheads in the case that they have already been set to 20%
     * inferred by presence of a matching overhead cost id
     */
    const shouldUpdateOverheads = !!input.overheadCostId;
    let newLabourTotal = 0;

    if (shouldUpdateOverheads) {
      if (input.id) {
        newLabourTotal = sumBy(input.labourProfile, x => (x.id === input.id ? totalCost : (x.value ?? 0)));
      } else {
        newLabourTotal = sumBy(input.labourProfile, x => x.value ?? 0) + totalCost;
      }

      await context.repositories.pcrSpendProfile.updateSingleItem({
        Id: input.overheadCostId as CostId,
        Acc_TotalCost__c: roundCurrency(newLabourTotal * 0.2),
      });
    }

    const payload = {
      Acc_CostCategoryID__c: input.costCategoryId,
      Acc_ProjectChangeRequest__c: params.itemId,
      Acc_ItemDescription__c: input.labourDescription,
      Acc_DaysSpentOnProject__c: input.daysSpentOnProject,
      Acc_GrossCostOfRole__c: parseCurrency(input.grossCostOfRole),
      Acc_Rate__c: parseCurrency(input.ratePerDay),
      Acc_TotalCost__c: totalCost,
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
