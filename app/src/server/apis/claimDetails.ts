import { contextProvider } from "@server/features/common/contextProvider";
import { processDto } from "@shared/processResponse";
import { SaveClaimDetails } from "@server/features/claimDetails/saveClaimDetailsCommand";
import { ApiParams, ControllerBaseWithSummary } from "./controllerBase";
import { ClaimDetailsSummaryDto, ClaimDetailsDto } from "@framework/dtos/claimDetailsDto";
import { ClaimDetailKey } from "@framework/types/ClaimDetailKey";
import { GetAllClaimDetailsByPartner } from "@server/features/claimDetails/getAllByPartnerQuery";
import { GetClaimDetailsQuery } from "@server/features/claimDetails/getClaimDetailsQuery";

export interface IClaimDetailsApi<Context extends "client" | "server"> {
  getAllByPartner: (params: ApiParams<Context, { partnerId: PartnerId }>) => Promise<ClaimDetailsSummaryDto[]>;
  get: (params: ApiParams<Context, ClaimDetailKey>) => Promise<ClaimDetailsDto>;
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

    this.getItems(
      "/",
      (p, q) => ({ partnerId: q.partnerId }),
      p => this.getAllByPartner(p),
    );
    this.getItem(
      "/:projectId/:partnerId/:periodId/:costCategoryId",
      p => ({
        projectId: p.projectId,
        partnerId: p.partnerId,
        periodId: parseInt(p.periodId, 10),
        costCategoryId: p.costCategoryId,
      }),
      p => this.get(p),
    );
    this.putItem(
      "/:projectId/:partnerId/:periodId/:costCategoryId",
      (p, q, b: ClaimDetailsDto) => ({
        projectId: p.projectId,
        partnerId: p.partnerId,
        periodId: parseInt(p.periodId, 10),
        costCategoryId: p.costCategoryId,
        claimDetails: processDto(b),
      }),
      p => this.saveClaimDetails(p),
    );
  }

  public async getAllByPartner(params: ApiParams<"server", { partnerId: PartnerId }>) {
    const { partnerId } = params;
    const query = new GetAllClaimDetailsByPartner(partnerId);
    return contextProvider.start(params).runQuery(query);
  }

  public async get(params: ApiParams<"server", ClaimDetailKey>) {
    const query = new GetClaimDetailsQuery(params.projectId, params.partnerId, params.periodId, params.costCategoryId);
    return contextProvider.start(params).runQuery(query);
  }

  public async saveClaimDetails(
    params: ApiParams<"server", ClaimDetailKey & { claimDetails: ClaimDetailsDto }>,
  ): Promise<ClaimDetailsDto> {
    const { projectId, partnerId, costCategoryId, periodId, claimDetails } = params;
    const context = contextProvider.start(params);
    const saveLineItemsCommand = new SaveClaimDetails(projectId, partnerId, periodId, costCategoryId, claimDetails);
    await context.runCommand(saveLineItemsCommand);

    const claimDetailsQuery = new GetClaimDetailsQuery(projectId, partnerId, periodId, costCategoryId);
    return context.runQuery(claimDetailsQuery);
  }
}

export const controller = new Controller();
