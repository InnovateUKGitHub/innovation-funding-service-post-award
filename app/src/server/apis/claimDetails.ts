import { contextProvider } from "@server/features/common/contextProvider";
import { processDto } from "@shared/processResponse";
import { SaveClaimDetails } from "@server/features/claimDetails/saveClaimDetailsCommand";
import { ApiParams, ControllerBaseWithSummary } from "./controllerBase";
import { ClaimDetailsSummaryDto, ClaimDetailsDto } from "@framework/dtos/claimDetailsDto";
import { ClaimDetailKey } from "@framework/types/ClaimDetailKey";
import { GetClaimDetailsQuery } from "@server/features/claimDetails/getClaimDetailsQuery";

export interface IClaimDetailsApi<Context extends "client" | "server"> {
  saveClaimDetails: (
    params: ApiParams<Context, ClaimDetailKey & { claimDetails: ClaimDetailsDto }>,
  ) => Promise<ClaimDetailsDto>;
}

class Controller
  extends ControllerBaseWithSummary<"server", ClaimDetailsSummaryDto, ClaimDetailsDto>
  implements IClaimDetailsApi<"server">
{
  constructor() {
    super("claim-details");

    this.putItem(
      "/:projectId/:partnerId/:periodId/:costCategoryId",
      (p, q, b: ClaimDetailsDto) => ({
        projectId: p.projectId,
        partnerId: p.partnerId,
        periodId: parseInt(p.periodId, 10) as PeriodId,
        costCategoryId: p.costCategoryId,
        claimDetails: processDto(b),
      }),
      p => this.saveClaimDetails(p),
    );
  }

  public async saveClaimDetails(
    params: ApiParams<"server", ClaimDetailKey & { claimDetails: ClaimDetailsDto }>,
  ): Promise<ClaimDetailsDto> {
    const { projectId, partnerId, costCategoryId, periodId, claimDetails } = params;
    const context = await contextProvider.start(params);
    const saveLineItemsCommand = new SaveClaimDetails(projectId, partnerId, periodId, costCategoryId, claimDetails);
    await context.runCommand(saveLineItemsCommand);

    const claimDetailsQuery = new GetClaimDetailsQuery(projectId, partnerId, periodId, costCategoryId);
    return context.runQuery(claimDetailsQuery);
  }
}

export const controller = new Controller();
