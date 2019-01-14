import { FormHandlerBase, IFormBody, IFormButton } from "./formHandlerBase";
import { ClaimDetailDocumentsRoute, EditClaimLineItemsParams, EditClaimLineItemsRoute, PrepareClaimRoute } from "../../ui/containers";
import { SaveLineItemsCommand } from "../features/claimLineItems";
import { ClaimLineItemDtosValidator } from "../../ui/validators";
import { range } from "../../shared/range";
import { IContext } from "../features/common/context";
import { findClaimLineItemsByPartnerCostCategoryAndPeriod } from "../../ui/redux/selectors";
import { ILinkInfo } from "../../types/ILinkInfo";

export class EditClaimLineItemsFormHandler extends FormHandlerBase<EditClaimLineItemsParams, ClaimLineItemDto[]> {

  constructor() {
    super(EditClaimLineItemsRoute, ["upload", "default"]);
  }

  protected getDto(context: IContext, params: EditClaimLineItemsParams, button: IFormButton, body: IFormBody) {
    const itemCount = parseInt(body.itemCount, 10) || 10;

    const dto = range(itemCount).map((x,i) => ({
      id: "",
      partnerId: params.partnerId,
      periodId: params.periodId,
      costCategoryId: params.costCategoryId,
      description: (body["description" + i] || undefined)!,
      value: ( body["value" + i] ? parseFloat(body["value" + i]) : undefined)!
    }));

    return Promise.resolve(dto);
  }

  protected createValidationResult(params: EditClaimLineItemsParams, dto: ClaimLineItemDto[]) {
    return new ClaimLineItemDtosValidator(dto, false);
  }

  protected getStoreInfo(params: EditClaimLineItemsParams): { key: string; store: string; } {
    return findClaimLineItemsByPartnerCostCategoryAndPeriod(params.partnerId, params.costCategoryId, params.periodId);
  }

  protected async run(context: IContext, params: EditClaimLineItemsParams, button: IFormButton, dto: ClaimLineItemDto[]): Promise<ILinkInfo> {
    const command = new SaveLineItemsCommand(params.partnerId, params.costCategoryId, params.periodId, dto);

    await context.runCommand(command);

    if(button.name === "upload") {
      return ClaimDetailDocumentsRoute.getLink(params);
    }

    return PrepareClaimRoute.getLink(params);
  }
}
