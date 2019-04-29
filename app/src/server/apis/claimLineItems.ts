import contextProvider from "../features/common/contextProvider";
import { ApiParams, ControllerBase } from "./controllerBase";
import { GetAllLineItemsForClaimByCategoryQuery } from "../features/claimLineItems";
import { processDto } from "../../shared/processResponse";
import { BadRequestError } from "../features/common/appError";
import { GetClaimDetailsQuery } from "@server/features/claimDetails";
import { ClaimLineItemsFormData } from "@framework/types/dtos/claimLineItemsFormData";
import { SaveLineItemsFormDataCommand } from "@server/features/claimLineItems/saveLineItemsFormDataCommand";

export interface IClaimLineItemApi {
  getAllForCategory: (params: ApiParams<{projectId: string, partnerId: string, costCategoryId: string, periodId: number}>) => Promise<ClaimLineItemDto[]>;
  saveLineItems: (params: ApiParams<{projectId: string, partnerId: string, costCategoryId: string, periodId: number, claimLineItemsFormData: ClaimLineItemsFormData}>) => Promise<ClaimLineItemsFormData>;
}

class Controller extends ControllerBase<ClaimLineItemDto> implements IClaimLineItemApi {

  constructor() {
    super("claim-line-items");
    this.getItems(
      "/",
      (p, q) => ({ projectId: q.projectId, partnerId: q.partnerId, periodId: parseInt(q.periodId, 10), costCategoryId: q.costCategoryId}),
      (p) => this.getAllForCategory(p)
    );
    this.putCustom(
      "/",
      (p, q, b) => ({
        projectId: q.projectId,
        partnerId: q.partnerId,
        periodId: parseInt(q.periodId, 10),
        costCategoryId: q.costCategoryId,
        claimLineItemsFormData: processDto(b)
      }),
      (p) => this.saveLineItems(p)
    );
  }

  public getAllForCategory(params: ApiParams<{ projectId: string, partnerId: string, costCategoryId: string, periodId: number }>) {
    const query = new GetAllLineItemsForClaimByCategoryQuery(params.projectId, params.partnerId, params.costCategoryId, params.periodId);
    return contextProvider.start(params).runQuery(query);
  }

  public async saveLineItems(params: ApiParams<{ projectId: string, partnerId: string, costCategoryId: string, periodId: number, claimLineItemsFormData: ClaimLineItemsFormData }>): Promise<ClaimLineItemsFormData> {

    const {projectId, partnerId, costCategoryId, periodId, claimLineItemsFormData } = params;
    const validRequest = projectId && partnerId && costCategoryId && periodId &&
      claimLineItemsFormData.lineItems.every(x => x.periodId === periodId && x.partnerId === partnerId && x.costCategoryId === costCategoryId);

    if (!validRequest) {
      throw new BadRequestError("Request is missing required fields");
    }

    const context = contextProvider.start(params);
    const saveLineItemsCommand = new SaveLineItemsFormDataCommand(projectId, partnerId, costCategoryId, periodId, claimLineItemsFormData);
    await context.runCommand(saveLineItemsCommand);

    const lineItemsQuery = new GetAllLineItemsForClaimByCategoryQuery(projectId, partnerId, costCategoryId, periodId);
    const claimDetailsQuery = new GetClaimDetailsQuery(partnerId, periodId, costCategoryId);

    const lineItems = await context.runQuery(lineItemsQuery);
    const claimDetails = await context.runQuery(claimDetailsQuery);

    return {
      lineItems,
      claimDetails
    };
  }
}

export const controller = new Controller();
