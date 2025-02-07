import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { errorMap } from "@ui/pages/pcrs/addPartner/spendProfile/spendProfile.zod";
import { PCRSpendProfileCostsSummaryRoute } from "@ui/pages/pcrs/addPartner/spendProfile/spendProfileCostsSummary.page";
import {
  PcrDeleteProjectCostParams,
  PCRSpendProfileDeleteCostRoute,
} from "@ui/pages/pcrs/addPartner/spendProfile/deleteProjectCost.page";

const emptySchema = z.object({ form: z.literal(FormTypes.PcrAddPartnerProjectCostDeleteItem) });
type EmptySchema = typeof emptySchema;

export class PcrItemAddPartnerSpendProfileDeleteItemHandler extends ZodFormHandlerBase<
  EmptySchema,
  PcrDeleteProjectCostParams
> {
  constructor() {
    super({
      routes: [PCRSpendProfileDeleteCostRoute],
      forms: [FormTypes.PcrAddPartnerProjectCostDeleteItem],
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

  protected async run({ context, params }: { context: IContext; params: PcrDeleteProjectCostParams }): Promise<string> {
    context.repositories.pcrSpendProfile.deleteSingleItem(params.costId);

    return PCRSpendProfileCostsSummaryRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
      itemId: params.itemId,
      costCategoryId: params.costCategoryId,
    }).path;
  }
}
