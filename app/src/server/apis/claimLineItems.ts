import contextProvider from "../features/common/contextProvider";
import {ControllerBase} from "./controllerBase";
import {GetAllLineItemsForClaimByCategoryQuery} from "../features/claims";
import {ClaimLineItemDto} from "../../ui/models";

export interface IClaimLineItemApi {
  getAllForCategory: (partnerId: string, costCategoryId: string, periodId: number) => Promise<ClaimLineItemDto[]>;
}

class Controller extends ControllerBase<ClaimLineItemDto> implements IClaimLineItemApi {

  constructor() {
    super("claim-line-items");
    this.getItems(
      "/",
      (p, q) => ({ partnerId: q.partnerId, periodId: parseInt(q.periodId, 10), costCategoryId: q.costCategoryId}),
      (p) => this.getAllForCategory(p.partnerId, p.costCategoryId, p.periodId)
    );
  }

  public getAllForCategory(partnerId: string, costCategoryId: string, periodId: number) {
    const query = new GetAllLineItemsForClaimByCategoryQuery(partnerId, costCategoryId, periodId);
    return contextProvider.start().runQuery(query);
  }
}

export const controller = new Controller();
