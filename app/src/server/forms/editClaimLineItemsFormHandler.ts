import { FormHandlerBase } from "./formHandlerBase";
import { ClaimDetailDocumentsRoute, EditClaimLineItemsParams, EditClaimLineItemsRoute, PrepareClaimRoute } from "../../ui/containers";
import contextProvider from "../features/common/contextProvider";
import { SaveLineItemsCommand } from "../features/claimLineItems";
import { ClaimLineItemDtosValidator } from "../../ui/validators";
import { range } from "../../shared/range";
import { ISession } from "../apis/controllerBase";
import { IContext } from "../features/common/context";
import { findClaimLineItemsByPartnerCostCategoryAndPeriod, getClaim } from "../../ui/redux/selectors";

export class EditClaimLineItemsFormHandler extends FormHandlerBase<EditClaimLineItemsParams, ClaimLineItemDto[]> {

  constructor() {
    super(EditClaimLineItemsRoute);
  }

  protected getDto(context: IContext, params: EditClaimLineItemsParams, button: string, body: { [key: string]: string }) {
    const dto = range(10).map((x,i) => ({
      id: "",
      partnerId: params.partnerId,
      periodId: params.periodId,
      costCategoryId: params.costCategoryId,
      description: (body["description" + i] || undefined)!,
      value: ( body["value" + i] ? parseFloat(body["value" + i]) : undefined)!
    }));

    return Promise.resolve(dto);
  }

  protected getSuccessLink(params: EditClaimLineItemsParams, button: string, body: { [key: string]: string }): ILinkInfo {
    if(button === "upload") {
      return ClaimDetailDocumentsRoute.getLink(params);
    }
    return PrepareClaimRoute.getLink(params);
  }

  protected createValidationResult(params: EditClaimLineItemsParams, dto: ClaimLineItemDto[]) {
    return new ClaimLineItemDtosValidator(dto, false);
  }

  protected getStoreInfo(params: EditClaimLineItemsParams): { key: string; store: string; } {
    return findClaimLineItemsByPartnerCostCategoryAndPeriod(params.partnerId, params.costCategoryId, params.periodId);
  }

  protected async run(context: IContext, params: EditClaimLineItemsParams, button: string, dto: ClaimLineItemDto[]): Promise<ILinkInfo> {
    const command = new SaveLineItemsCommand(params.partnerId, params.costCategoryId, params.periodId, dto);

    await context.runCommand(command);

    if(button === "upload") {
      return ClaimDetailDocumentsRoute.getLink(params);
    }

    return PrepareClaimRoute.getLink(params);
  }
}
