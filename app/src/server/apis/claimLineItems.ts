import contextProvider from "../features/common/contextProvider";
import { ApiParams, ControllerBase } from "./controllerBase";
import { GetAllLineItemsForClaimByCategoryQuery, SaveLineItemsCommand } from "../features/claimLineItems";
import { processDto } from "../../shared/processResponse";
import { BadRequestError } from "../features/common/appError";

export interface IClaimLineItemApi {
  getAllForCategory: (params: ApiParams<{projectId: string, partnerId: string, costCategoryId: string, periodId: number}>) => Promise<ClaimLineItemDto[]>;
  saveLineItems: (params: ApiParams<{projectId: string, partnerId: string, costCategoryId: string, periodId: number, lineItems: ClaimLineItemDto[]}>) => Promise<ClaimLineItemDto[]>;
}

class Controller extends ControllerBase<ClaimLineItemDto> implements IClaimLineItemApi {

  constructor() {
    super("claim-line-items");
    this.getItems(
      "/",
      (p, q) => ({ projectId: q.projectId, partnerId: q.partnerId, periodId: parseInt(q.periodId, 10), costCategoryId: q.costCategoryId}),
      (p) => this.getAllForCategory(p)
    );
    this.postItems(
      "/",
      (p, q, b) => ({
        projectId: q.projectId,
        partnerId: q.partnerId,
        periodId: parseInt(q.periodId, 10),
        costCategoryId: q.costCategoryId,
        lineItems: processDto(b)
      }),
      (p) => this.saveLineItems(p)
    );
  }

  public getAllForCategory(params: ApiParams<{ projectId: string, partnerId: string, costCategoryId: string, periodId: number }>) {
    const query = new GetAllLineItemsForClaimByCategoryQuery(params.projectId, params.partnerId, params.costCategoryId, params.periodId);
    return contextProvider.start(params).runQuery(query);
  }

  public async saveLineItems(params: ApiParams<{ projectId: string, partnerId: string, costCategoryId: string, periodId: number, lineItems: ClaimLineItemDto[] }>): Promise<ClaimLineItemDto[]> {

    const {projectId, partnerId, costCategoryId, periodId, lineItems } = params;
    const validRequest = projectId && partnerId && costCategoryId && periodId &&
      lineItems.every(x => x.periodId === periodId && x.partnerId === partnerId && x.costCategoryId === costCategoryId);

    if (!validRequest) {
      throw new BadRequestError("Request is missing required fields");
    }

    const command = new SaveLineItemsCommand(partnerId, costCategoryId, periodId, lineItems);
    const context = contextProvider.start(params);

    await context.runCommand(command);

    const query = new GetAllLineItemsForClaimByCategoryQuery(projectId, partnerId, costCategoryId, periodId);
    return context.runQuery(query);
  }
}

export const controller = new Controller();
