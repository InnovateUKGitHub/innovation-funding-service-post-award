import { GetClaimDetailsQuery } from "@server/features/claimDetails";
import { FormHandlerBase, IFormBody, IFormButton } from "@server/forms/formHandlerBase";
import {
  ClaimDetailDocumentsRoute,
  EditClaimDetailsParams,
  EditClaimLineItemsRoute,
  PrepareClaimRoute
} from "@ui/containers";
import { IContext, ILinkInfo } from "@framework/types";
import { range } from "@shared/range";
import { SaveClaimDetails } from "@server/features/claimDetails/saveClaimDetailsCommand";
import { getClaimDetailsEditor } from "@ui/redux/selectors";
import { ClaimDetailsValidator } from "@ui/validators/claimDetailsValidator";

export class EditClaimLineItemsFormHandler extends FormHandlerBase<EditClaimDetailsParams, ClaimDetailsDto, ClaimDetailsValidator> {

  constructor() {
    super(EditClaimLineItemsRoute, ["upload", "default"]);
  }

  protected async getDto(context: IContext, params: EditClaimDetailsParams, button: IFormButton, body: IFormBody) {
    const itemCount = parseInt(body.itemCount, 10) || 10;

    const originalClaimDetails = await context.runQuery(new GetClaimDetailsQuery(params.projectId, params.partnerId, params.periodId, params.costCategoryId));

    const lineItems = range(itemCount).map((x,i) => ({
      id: "",
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

  protected getStoreInfo(params: EditClaimDetailsParams): { key: string; store: string; } {
    return getClaimDetailsEditor(params.partnerId, params.periodId, params.costCategoryId);
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
