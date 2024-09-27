import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { GetPcrSpendProfilesQuery } from "@server/features/pcrs/getPcrSpendProfiles";
import { errorMap } from "@ui/pages/pcrs/addPartner/spendProfile/spendProfile.zod";

import { PCRSpendProfileCostsSummaryRoute } from "@ui/pages/pcrs/addPartner/spendProfile/spendProfileCostsSummary.page";
import { updatePcrItem } from "../../../../addPartnerUtils";
import {
  PcrDeleteSpendProfileCostParams,
  PCRSpendProfileDeleteCostRoute,
} from "@ui/pages/pcrs/addPartner/spendProfile/spendProfileDeleteCost.page";

const emptySchema = z.object({ form: z.literal(FormTypes.PcrAddPartnerSPendProfileDeleteItem) });
type EmptySchema = typeof emptySchema;

export class PcrItemAddPartnerSpendProfileDeleteItemHandler extends ZodFormHandlerBase<
  EmptySchema,
  PcrDeleteSpendProfileCostParams
> {
  constructor() {
    super({
      routes: [PCRSpendProfileDeleteCostRoute],
      forms: [FormTypes.PcrAddPartnerSPendProfileDeleteItem],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: emptySchema,
      errorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<EmptySchema>> {
    return {
      form: input.form,
    };
  }

  protected async run({
    context,
    params,
  }: {
    context: IContext;
    params: PcrDeleteSpendProfileCostParams;
  }): Promise<string> {
    const spendProfile = await context.runQuery(new GetPcrSpendProfilesQuery(params.projectId, params.itemId));

    const itemIndex = spendProfile.costs.findIndex(x => x.id === params.costId);

    const nextCosts = [...spendProfile.costs.slice(0, itemIndex), ...spendProfile.costs.slice(itemIndex + 1)];

    await updatePcrItem({
      params,
      context,
      data: {
        spendProfile: {
          ...spendProfile,
          costs: nextCosts,
        },
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
