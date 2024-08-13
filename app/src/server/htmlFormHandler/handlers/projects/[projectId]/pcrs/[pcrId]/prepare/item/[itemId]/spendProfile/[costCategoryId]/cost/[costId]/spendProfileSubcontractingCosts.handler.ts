import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { GetPcrSpendProfilesQuery } from "@server/features/pcrs/getPcrSpendProfiles";
import {
  errorMap,
  SubcontractingSchemaType,
  subcontractingSchema,
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

export class PcrItemAddPartnerSpendProfileSubcontractingCostsHandler extends ZodFormHandlerBase<
  SubcontractingSchemaType,
  [PcrAddSpendProfileCostParams, PcrEditSpendProfileCostParams]
> {
  constructor() {
    super({
      routes: [PCRSpendProfileAddCostRoute, PCRSpendProfileEditCostRoute],
      forms: [FormTypes.PcrAddPartnerSpendProfileSubcontractingCost],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: subcontractingSchema,
      errorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<SubcontractingSchemaType>> {
    const id = typeof input.id === "string" && input.id.trim().length > 0 ? input.id : null;

    return {
      id,
      form: input.form,
      costCategoryType: parseInt(input.costCategoryType) as CostCategoryType,
      subcontractorName: input.subcontractorName,
      subcontractorCountry: input.subcontractorCountry,
      subcontractorRoleAndDescription: input.subcontractorRoleAndDescription,
      subcontractorCost: input.subcontractorCost,
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<SubcontractingSchemaType>;
    context: IContext;
    params: PcrAddSpendProfileCostParams;
  }): Promise<string> {
    const spendProfile = await context.runQuery(new GetPcrSpendProfilesQuery(params.projectId, params.itemId));

    spendProfile.costs.push({
      costCategory: input.costCategoryType,
      id: input.id as CostId,
      costCategoryId: params.costCategoryId,
      description: input.subcontractorName,
      subcontractorRoleAndDescription: input.subcontractorRoleAndDescription,
      subcontractorCountry: input.subcontractorCountry,
      value: parseCurrency(input.subcontractorCost),
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
