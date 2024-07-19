import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { GetPcrSpendProfilesQuery } from "@server/features/pcrs/getPcrSpendProfiles";
import {
  labourSchema,
  LabourSchemaType,
  errorMap,
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

export class PcrItemAddPartnerSpendProfileLabourCostsHandler extends ZodFormHandlerBase<
  LabourSchemaType,
  [PcrAddSpendProfileCostParams, PcrEditSpendProfileCostParams]
> {
  constructor() {
    super({
      routes: [PCRSpendProfileAddCostRoute, PCRSpendProfileEditCostRoute],
      forms: [FormTypes.PcrAddPartnerSpendProfileLabourCost],
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
    return {
      id: input.id,
      form: input.form,
      descriptionOfRole: input.descriptionOfRole,
      grossCostOfRole: input.grossCostOfRole,
      ratePerDay: input.ratePerDay,
      daysSpentOnProject: input.daysSpentOnProject,
      costCategoryType: parseInt(input.costCategoryType) as CostCategoryType,
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
    const spendProfile = await context.runQuery(new GetPcrSpendProfilesQuery(params.projectId, params.itemId));

    spendProfile.costs.push({
      costCategory: input.costCategoryType,
      id: input.id as CostId,
      costCategoryId: params.costCategoryId,
      description: input.descriptionOfRole,
      daysSpentOnProject: input.daysSpentOnProject,
      grossCostOfRole: parseCurrency(input.grossCostOfRole),
      ratePerDay: parseCurrency(input.ratePerDay),
      value: parseCurrency(input.ratePerDay) * input.daysSpentOnProject,
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
