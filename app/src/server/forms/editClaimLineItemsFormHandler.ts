import { GetClaimDetailsQuery } from "@server/features/claimDetails";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import {
  ClaimDetailDocumentsRoute,
  EditClaimDetailsParams,
  EditClaimLineItemsRoute,
  PrepareClaimRoute
} from "@ui/containers";
import { IContext, ILinkInfo } from "@framework/types";
import { range } from "@shared/range";
import { SaveClaimDetails } from "@server/features/claimDetails/saveClaimDetailsCommand";
import { ClaimDetailsValidator } from "@ui/validators/claimDetailsValidator";
import { storeKeys } from "@ui/redux/stores/storeKeys";

export class EditClaimLineItemsFormHandler extends StandardFormHandlerBase<EditClaimDetailsParams, "claimDetail"> {

  constructor() {
    super(EditClaimLineItemsRoute, ["upload", "default"], "claimDetail");
  }

  protected async getDto(context: IContext, params: EditClaimDetailsParams, button: IFormButton, body: IFormBody) {
    const itemCount = parseInt(body.itemCount, 10) || 10;

    const originalClaimDetails = await context.runQuery(new GetClaimDetailsQuery(params.projectId, params.partnerId, params.periodId, params.costCategoryId));

    const lineItems = range(itemCount).map((x,i) => ({
      id: body["id" + i] || undefined,
      partnerId: params.partnerId,
      periodId: params.periodId,
      costCategoryId: params.costCategoryId,
      description: (body["description" + i] || undefined)!,
      value: ( body["value" + i] ? parseFloat(body["value" + i]) : undefined)!
    }));

    return Promise.resolve(Object.assign({}, originalClaimDetails, {
      comments: body.comments,
      lineItems
    }));
  }

  protected createValidationResult(params: EditClaimDetailsParams, dto: ClaimDetailsDto) {
    return new ClaimDetailsValidator(dto, false);
  }

  protected getStoreKey(params: EditClaimDetailsParams) {
    return storeKeys.getClaimDetailKey(params.partnerId, params.periodId, params.costCategoryId);
  }

  protected async run(context: IContext, params: EditClaimDetailsParams, button: IFormButton, dto: ClaimDetailsDto): Promise<ILinkInfo> {
    const command = new SaveClaimDetails(params.projectId, params.partnerId, params.periodId, params.costCategoryId, dto);

    await context.runCommand(command);

    if(button.name === "upload") {
      return ClaimDetailDocumentsRoute.getLink(params);
    }

    return PrepareClaimRoute.getLink(params);
  }
}
