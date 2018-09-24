import contextProvider from "../features/common/contextProvider";
import {ControllerBase} from "./controllerBase";
import {GetAllLineItemsForClaimByCategoryQuery} from "../features/claims";
import {ClaimLineItemDto} from "../../ui/models";

export interface IClaimLineItemApi {
  getAllForClaimByCategoryId: (claimId: string, costCategoryId: number) => Promise<ClaimLineItemDto[]>;
}

class Controller extends ControllerBase<ClaimLineItemDto> implements IClaimLineItemApi {

  public path = "claims";

  constructor() {
    super();
    this.getItems(
      "/:claimId/lineitems?:costCategoryId",
      (p, q) => ({ claimId: p.claimId, costCategoryId: parseInt(q.costCategoryId, 10)}),
      (p) => this.getAllForClaimByCategoryId(p.claimId, p.costCategoryId)
    );
  }

  public getAllForClaimByCategoryId(claimId: string, costCategoryId: number) {
    const query = new GetAllLineItemsForClaimByCategoryQuery(claimId, costCategoryId);
    return contextProvider.start().runQuery(query);
  }
}

export const controller = new Controller();
