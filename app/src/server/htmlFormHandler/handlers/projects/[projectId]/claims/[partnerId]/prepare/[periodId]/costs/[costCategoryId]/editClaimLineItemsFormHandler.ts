import { range } from "@shared/range";
import { SaveClaimDetails } from "@server/features/claimDetails/saveClaimDetailsCommand";
import { ClaimDetailsValidator } from "@ui/validation/validators/claimDetailsValidator";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { ClaimDetailsDto } from "@framework/dtos/claimDetailsDto";
import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { GetClaimDetailsQuery } from "@server/features/claimDetails/getClaimDetailsQuery";
import { StandardFormHandlerBase, IFormButton, IFormBody } from "@server/htmlFormHandler/formHandlerBase";
import { ClaimDetailDocumentsRoute } from "@ui/containers/pages/claims/claimDetailDocuments.page";
import { EditClaimDetailsParams, EditClaimLineItemsRoute } from "@ui/containers/pages/claims/editClaimLineItems.page";
import { PrepareClaimRoute } from "@ui/containers/pages/claims/claimPrepare.page";

export class EditClaimLineItemsFormHandler extends StandardFormHandlerBase<EditClaimDetailsParams, "claimDetail"> {
  constructor() {
    super(EditClaimLineItemsRoute, ["upload", "default"], "claimDetail");
  }

  protected async getDto(context: IContext, params: EditClaimDetailsParams, button: IFormButton, body: IFormBody) {
    const itemCount = parseInt(body.itemCount, 10) || 10;

    const originalClaimDetails = await context.runQuery(
      new GetClaimDetailsQuery(params.projectId, params.partnerId, params.periodId, params.costCategoryId),
    );

    const lineItems = range(itemCount).map((x, i) => ({
      id: body["id" + i] || undefined,
      partnerId: params.partnerId,
      periodId: params.periodId,
      costCategoryId: params.costCategoryId,
      description: body["description" + i] || undefined,
      value: body["value" + i] ? parseFloat(body["value" + i]) : undefined,
    }));

    return Promise.resolve(
      Object.assign({}, originalClaimDetails, {
        comments: body.comments,
        lineItems,
      }),
    );
  }

  protected createValidationResult(params: EditClaimDetailsParams, dto: ClaimDetailsDto) {
    return new ClaimDetailsValidator({ model: dto, showValidationErrors: false });
  }

  protected getStoreKey(params: EditClaimDetailsParams) {
    return storeKeys.getClaimDetailKey(params.partnerId, params.periodId, params.costCategoryId);
  }

  protected async run(
    context: IContext,
    params: EditClaimDetailsParams,
    button: IFormButton,
    dto: ClaimDetailsDto,
  ): Promise<ILinkInfo> {
    const command = new SaveClaimDetails(
      params.projectId,
      params.partnerId,
      params.periodId,
      params.costCategoryId,
      dto,
    );

    await context.runCommand(command);

    if (button.name === "upload") {
      return ClaimDetailDocumentsRoute.getLink(params);
    }

    return PrepareClaimRoute.getLink(params);
  }
}
