import contextProvider from "../features/common/contextProvider";
import {ControllerBase, ISession} from "./controllerBase";
import {GetAllLineItemsForClaimByCategoryQuery, SaveLineItemsCommand} from "../features/claimLineItems";
import {ClaimLineItemDto} from "../../ui/models";
import {ApiError, StatusCode} from "./ApiError";
import {processDto} from "../../shared/processResponse";
import {ValidationError} from "../../shared/validation";

export interface IClaimLineItemApi {
  getAllForCategory: (params: {partnerId: string, costCategoryId: string, periodId: number} & ISession) => Promise<ClaimLineItemDto[]>;
  saveLineItems: (params: {partnerId: string, costCategoryId: string, periodId: number, lineItems: ClaimLineItemDto[]} & ISession) => Promise<ClaimLineItemDto[]>;
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

  public getAllForCategory(params: { partnerId: string, costCategoryId: string, periodId: number } & ISession) {
    const query = new GetAllLineItemsForClaimByCategoryQuery(params.partnerId, params.costCategoryId, params.periodId);
    return contextProvider.start(params.user).runQuery(query);
  }

  public async saveLineItems(params: {partnerId: string, costCategoryId: string, periodId: number, lineItems: ClaimLineItemDto[] } & ISession): Promise<ClaimLineItemDto[]> {

    const {partnerId, costCategoryId, periodId, lineItems, user } = params;
    const validRequest = partnerId && costCategoryId && periodId &&
      lineItems.every(x => x.periodId === periodId && x.partnerId === partnerId && x.costCategoryId === costCategoryId);

    if (!validRequest) {
      throw new ApiError(StatusCode.BAD_REQUEST,"Request is missing required fields");
    }

    const command = new SaveLineItemsCommand(partnerId, costCategoryId, periodId, lineItems);

    const context = contextProvider.start(user);

    await context.runCommand(command);

    const query = new GetAllLineItemsForClaimByCategoryQuery(partnerId, costCategoryId, periodId);
    return context.runQuery(query);
  }
}

export const controller = new Controller();
