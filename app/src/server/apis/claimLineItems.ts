import contextProvider from "../features/common/contextProvider";
import {ApiParams, ControllerBase} from "./controllerBase";
import {GetAllLineItemsForClaimByCategoryQuery, SaveLineItemsCommand} from "../features/claimLineItems";
import {ApiError, StatusCode} from "./ApiError";
import {processDto} from "../../shared/processResponse";

export interface IClaimLineItemApi {
  getAllForCategory: (params: ApiParams<{partnerId: string, costCategoryId: string, periodId: number}>) => Promise<ClaimLineItemDto[]>;
  saveLineItems: (params: ApiParams<{partnerId: string, costCategoryId: string, periodId: number, lineItems: ClaimLineItemDto[]}>) => Promise<ClaimLineItemDto[]>;
}

class Controller extends ControllerBase<ClaimLineItemDto> implements IClaimLineItemApi {

  constructor() {
    super("claim-line-items");
    this.getItems(
      "/",
      (p, q) => ({ partnerId: q.partnerId, periodId: parseInt(q.periodId, 10), costCategoryId: q.costCategoryId}),
      (p) => this.getAllForCategory(p)
    );
    this.postItems(
      "/",
      (p, q, b) => ({
        partnerId: q.partnerId,
        periodId: parseInt(q.periodId, 10),
        costCategoryId: q.costCategoryId,
        lineItems: processDto(b)
      }),
      (p) => this.saveLineItems(p)
    );
  }

  public getAllForCategory(params: ApiParams<{ partnerId: string, costCategoryId: string, periodId: number }>) {
    const query = new GetAllLineItemsForClaimByCategoryQuery(params.partnerId, params.costCategoryId, params.periodId);
    return contextProvider.start(params).runQuery(query);
  }

  public async saveLineItems(params: ApiParams<{partnerId: string, costCategoryId: string, periodId: number, lineItems: ClaimLineItemDto[] }>): Promise<ClaimLineItemDto[]> {

    const {partnerId, costCategoryId, periodId, lineItems } = params;
    const validRequest = partnerId && costCategoryId && periodId &&
      lineItems.every(x => x.periodId === periodId && x.partnerId === partnerId && x.costCategoryId === costCategoryId);

    if (!validRequest) {
      throw new ApiError(StatusCode.BAD_REQUEST,"Request is missing required fields");
    }

    const command = new SaveLineItemsCommand(partnerId, costCategoryId, periodId, lineItems);

    const context = contextProvider.start(params);

    await context.runCommand(command);

    const query = new GetAllLineItemsForClaimByCategoryQuery(partnerId, costCategoryId, periodId);
    return context.runQuery(query);
  }
}

export const controller = new Controller();
