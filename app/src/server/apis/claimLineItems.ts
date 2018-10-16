import contextProvider from "../features/common/contextProvider";
import {ControllerBase} from "./controllerBase";
import {GetAllLineItemsForClaimByCategoryQuery, SaveLineItemsCommand} from "../features/claimLineItems";
import {ClaimLineItemDto} from "../../ui/models";
import {ApiError, ErrorCode} from "./ApiError";
import {processDto} from "../../shared/processResponse";
import {ValidationError} from "../../shared/validation";

export interface IClaimLineItemApi {
  getAllForCategory: (partnerId: string, costCategoryId: string, periodId: number) => Promise<ClaimLineItemDto[]>;
  saveLineItems: (partnerId: string, costCategoryId: string, periodId: number, lineItems: ClaimLineItemDto[]) => Promise<ClaimLineItemDto[]>;
}

class Controller extends ControllerBase<ClaimLineItemDto> implements IClaimLineItemApi {

  constructor() {
    super("claim-line-items");
    this.getItems(
      "/",
      (p, q) => ({ partnerId: q.partnerId, periodId: parseInt(q.periodId, 10), costCategoryId: q.costCategoryId}),
      (p) => this.getAllForCategory(p.partnerId, p.costCategoryId, p.periodId)
    );
    this.postItems(
      "/",
      (p, q, b) => ({
        partnerId: q.partnerId,
        periodId: parseInt(q.periodId, 10),
        costCategoryId: q.costCategoryId,
        lineItems: processDto(b)
      }),
      (p) => this.saveLineItems(p.partnerId, p.costCategoryId, p.periodId, p.lineItems)
    );
  }

  public getAllForCategory(partnerId: string, costCategoryId: string, periodId: number) {
    const query = new GetAllLineItemsForClaimByCategoryQuery(partnerId, costCategoryId, periodId);
    return contextProvider.start().runQuery(query);
  }

  public async saveLineItems(partnerId: string, costCategoryId: string, periodId: number, lineItems: ClaimLineItemDto[]): Promise<ClaimLineItemDto[]> {

    const validRequest = partnerId && costCategoryId && periodId &&
      lineItems.every(x => x.periodId === periodId && x.partnerId === partnerId && x.costCategoryId === costCategoryId);

    if (!validRequest) {
      throw new ApiError(ErrorCode.BAD_REQUEST,"Request is missing required fields");
    }

    const command = new SaveLineItemsCommand(partnerId, costCategoryId, periodId, lineItems);

    const context = contextProvider.start();

    await context.runCommand(command).catch(e => {
      if (e instanceof ValidationError) {
        throw new ApiError(ErrorCode.BAD_REQUEST, e);
      }
      throw new ApiError(ErrorCode.INTERNAL_SERVER_ERROR, "Failed to update claim line items");
    });

    const query = new GetAllLineItemsForClaimByCategoryQuery(partnerId, costCategoryId, periodId);
    return context.runQuery(query);
  }
}

export const controller = new Controller();
