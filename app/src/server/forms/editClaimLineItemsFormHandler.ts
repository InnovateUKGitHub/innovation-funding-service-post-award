import { ClaimLineItemsFormData } from "@framework/types/dtos/claimLineItemsFormData";
import { GetClaimDetailsQuery } from "@server/features/claimDetails";
import { SaveLineItemsFormDataCommand } from "@server/features/claimLineItems/saveLineItemsFormDataCommand";
import { FormHandlerBase, IFormBody, IFormButton } from "@server/forms/formHandlerBase";
import {
  ClaimDetailDocumentsRoute,
  EditClaimLineItemsParams,
  EditClaimLineItemsRoute,
  PrepareClaimRoute
} from "@ui/containers";
import { IContext, ILinkInfo } from "@framework/types";
import { ClaimLineItemFormValidator } from "@ui/validators";
import { getClaimLineItemEditor } from "@ui/redux/selectors";
import { range } from "@shared/range";

export class EditClaimLineItemsFormHandler extends FormHandlerBase<EditClaimLineItemsParams, ClaimLineItemsFormData> {

  constructor() {
    super(EditClaimLineItemsRoute, ["upload", "default"]);
  }

  protected async getDto(context: IContext, params: EditClaimLineItemsParams, button: IFormButton, body: IFormBody) {
    const itemCount = parseInt(body.itemCount, 10) || 10;

    const originalClaimDetails = await context.runQuery(new GetClaimDetailsQuery(params.projectId, params.partnerId, params.periodId, params.costCategoryId));
    const claimDetails: ClaimDetailsDto = {
      ...originalClaimDetails,
      comments: body.comments
    };
    const lineItems = range(itemCount).map((x,i) => ({
      id: "",
      partnerId: params.partnerId,
      periodId: params.periodId,
      costCategoryId: params.costCategoryId,
      description: (body["description" + i] || undefined)!,
      value: ( body["value" + i] ? parseFloat(body["value" + i]) : undefined)!
    }));

    return Promise.resolve({
      claimDetails,
      lineItems
    });
  }

  protected createValidationResult(params: EditClaimLineItemsParams, dto: ClaimLineItemsFormData) {
    return new ClaimLineItemFormValidator(dto, false);
  }

  protected getStoreInfo(params: EditClaimLineItemsParams): { key: string; store: string; } {
    return getClaimLineItemEditor(params.partnerId, params.periodId, params.costCategoryId);
  }

  protected async run(context: IContext, params: EditClaimLineItemsParams, button: IFormButton, dto: ClaimLineItemsFormData): Promise<ILinkInfo> {
    const command = new SaveLineItemsFormDataCommand(params.projectId, params.partnerId, params.costCategoryId, params.periodId, dto);

    await context.runCommand(command);

    if(button.name === "upload") {
      return ClaimDetailDocumentsRoute.getLink(params);
    }

    return PrepareClaimRoute.getLink(params);
  }
}
