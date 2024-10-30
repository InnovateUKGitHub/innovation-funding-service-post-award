import { IContext } from "@framework/types/IContext";
import { GetPcrSpendProfilesQuery } from "@server/features/pcrs/getPcrSpendProfiles";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import {
  OverheadDocumentsPageParams,
  PCRSpendProfileOverheadDocumentRoute,
} from "@ui/pages/pcrs/addPartner/spendProfile/overheadDocumentContainer.page";
import {
  overheadDocumentsSchema,
  errorMap,
  OverheadDocumentsSchemaType,
} from "@ui/pages/pcrs/addPartner/spendProfile/spendProfile.zod";
import { PCRSpendProfileEditCostRoute } from "@ui/pages/pcrs/addPartner/spendProfile/spendProfilePrepareCost.page";
import { FormTypes } from "@ui/zod/FormTypes";

class OverheadDocumentsHandler extends ZodFormHandlerBase<OverheadDocumentsSchemaType, OverheadDocumentsPageParams> {
  constructor() {
    super({
      routes: [PCRSpendProfileOverheadDocumentRoute],
      forms: [FormTypes.PcrAddPartnerSpendProfileOverheadDocuments],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: overheadDocumentsSchema,
      errorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }) {
    return {
      form: input.form,
    };
  }

  protected async run({
    context,
    params,
  }: {
    context: IContext;
    params: OverheadDocumentsPageParams;
  }): Promise<string> {
    const spendProfile = await context.runQuery(new GetPcrSpendProfilesQuery(params.projectId, params.itemId));

    const cost = spendProfile.costs.find(x => x.costCategoryId === params.costCategoryId);
    if (!cost) throw new Error(`Cannot find cost matching ${params.costCategoryId}`);

    const path = PCRSpendProfileEditCostRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
      itemId: params.itemId,
      costCategoryId: params.costCategoryId,
      costId: cost.id,
    }).path;

    return path;
  }
}

export { OverheadDocumentsHandler };
