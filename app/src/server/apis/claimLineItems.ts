import contextProvider from "../features/common/contextProvider";
import {ControllerBase} from "./controllerBase";
import {GetAllLineItemsForClaimByCategoryQuery, GetClaim} from "../features/claims";
import {ClaimLineItemDto} from "../../ui/models";
import {ApiError, ErrorCode} from "./ApiError";
import {SaveLineItemsCommand} from "../features/claimLineItems/saveLineItemsCommand";
import {processDto} from "../../shared/processResponse";

export interface IClaimLineItemApi {
  getAllForCategory: (partnerId: string, costCategoryId: string, periodId: number) => Promise<ClaimLineItemDto[]>;
  saveLineItems: (partnerId: string, costCategoryId: string, periodId: number, lineItems: Partial<ClaimLineItemDto>[]) => Promise<ClaimLineItemDto[]>;
}

class Controller extends ControllerBase<ClaimLineItemDto> implements IClaimLineItemApi {

  constructor() {
    super("claim-line-items");
    this.getItems(
      "/",
      (p, q) => ({ partnerId: q.partnerId, periodId: parseInt(q.periodId, 10), costCategoryId: q.costCategoryId}),
      (p) => this.getAllForCategory(p.partnerId, p.costCategoryId, p.periodId)
    );
    this.postItem(
      "/",
      (p, q, b) => ({partnerId: q.partnerId, periodId: parseInt(q.periodId, 10), costCategoryId: q.costCategoryId, lineItems: b.map(processDto)}),
      (p) => this.saveLineItems(p.partnerId, p.costCategoryId, p.periodId, p.lineItems)
    );
  }

  public getAllForCategory(partnerId: string, costCategoryId: string, periodId: number) {
    const query = new GetAllLineItemsForClaimByCategoryQuery(partnerId, costCategoryId, periodId);
    return contextProvider.start().runQuery(query);
  }

  public async saveLineItems(partnerId: string, costCategoryId: string, periodId: number, lineItems: Partial<ClaimLineItemDto>[]) {

    const validRequest = partnerId && costCategoryId && periodId &&
      lineItems.every(x => console.log(x.periodId, periodId, x.partnerId, partnerId, x.costCategoryId, costCategoryId) || x.periodId === periodId && x.partnerId === partnerId && x.costCategoryId === costCategoryId);

    console.log(partnerId,costCategoryId, periodId, validRequest);

    if (!validRequest) {
      throw new ApiError(ErrorCode.BAD_REQUEST,"Request is missing required fields");
    }

    const command = new SaveLineItemsCommand(partnerId, costCategoryId, periodId, lineItems);

    await contextProvider.start().runCommand(command).catch(e => {
      console.log("Api Error: ", e);
      throw new ApiError(ErrorCode.INTERNAL_SERVER_ERROR, "Failed to update claim line items");
    });

    const query = new GetAllLineItemsForClaimByCategoryQuery(partnerId, costCategoryId, periodId);
    return contextProvider.start().runQuery(query);
  }
}

export const controller = new Controller();
