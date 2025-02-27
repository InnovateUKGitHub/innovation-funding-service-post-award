import { contextProvider } from "@server/features/common/contextProvider";
import { processDto } from "@shared/processResponse";
import { ApiParams, ControllerBaseWithSummary } from "./controllerBase";
import { ClaimDetailsSummaryDto, ClaimLineItemsDto } from "@framework/dtos/claimDetailsDto";
import { ClaimDetailKey } from "@framework/types/ClaimDetailKey";
import { UpdateClaimLineItemsCommand } from "@server/features/claimDetails/updateClaimLineItemsCommand";

export interface IClaimDetailsApi<Context extends "client" | "server"> {
  updateClaimLineItems: (
    params: ApiParams<Context, ClaimDetailKey & { claimDetails: ClaimLineItemsDto }>,
  ) => Promise<boolean>;
}

class Controller
  extends ControllerBaseWithSummary<"server", ClaimDetailsSummaryDto, ClaimLineItemsDto>
  implements IClaimDetailsApi<"server">
{
  constructor() {
    super("claim-details");

    this.putItem(
      "/:projectId/:partnerId/:periodId/:costCategoryId/claim-line-items",
      (p, q, b: ClaimLineItemsDto) => ({
        projectId: p.projectId,
        partnerId: p.partnerId,
        periodId: parseInt(p.periodId, 10) as PeriodId,
        costCategoryId: p.costCategoryId,
        claimDetails: processDto(b),
      }),
      p => this.updateClaimLineItems(p),
    );
  }

  public async updateClaimLineItems(
    params: ApiParams<"server", ClaimDetailKey & { claimDetails: ClaimLineItemsDto }>,
  ): Promise<boolean> {
    const { projectId, partnerId, costCategoryId, periodId, claimDetails } = params;
    const context = await contextProvider.start(params);
    await context.runCommand(
      new UpdateClaimLineItemsCommand(projectId, partnerId, periodId, costCategoryId, claimDetails),
    );

    return true;
  }
}

export const controller = new Controller();
