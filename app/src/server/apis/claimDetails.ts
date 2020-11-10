import { ApiParams, ControllerBaseWithSummary } from "./controllerBase";
import contextProvider from "@server/features/common/contextProvider";
import { GetAllClaimDetailsByPartner, GetClaimDetailsQuery } from "@server/features/claimDetails";
import { processDto } from "@shared/processResponse";
import { SaveClaimDetails } from "@server/features/claimDetails/saveClaimDetailsCommand";
import { ClaimDetailsDto, ClaimDetailsSummaryDto } from "@framework/dtos";
import { ClaimDetailKey } from "@framework/types";

export interface IClaimDetailsApi {
  getAllByPartner: (params: ApiParams<{ partnerId: string }>) => Promise<ClaimDetailsSummaryDto[]>;
  get: (params: ApiParams<ClaimDetailKey>) => Promise<ClaimDetailsDto>;
  saveClaimDetails: (params: ApiParams<ClaimDetailKey & { claimDetails: ClaimDetailsDto }>) => Promise<ClaimDetailsDto>;
}

class Controller extends ControllerBaseWithSummary<ClaimDetailsSummaryDto, ClaimDetailsDto> implements IClaimDetailsApi {
  constructor() {
    super("claim-details");

    this.getItems("/", (p, q) => ({ partnerId: q.partnerId, }), (p) => this.getAllByPartner(p));
    this.getItem("/:projectId/:partnerId/:periodId/:costCategoryId",
      (p) => ({
        projectId: p.projectId,
        partnerId: p.partnerId,
        periodId: parseInt(p.periodId, 10),
        costCategoryId: p.costCategoryId
      }),
      p => this.get(p));
    this.putItem("/:projectId/:partnerId/:periodId/:costCategoryId",
      (p, q, b) => ({
        projectId: p.projectId,
        partnerId: p.partnerId,
        periodId: parseInt(p.periodId, 10),
        costCategoryId: p.costCategoryId,
        claimDetails: processDto(b)
      }),
      (p) => this.saveClaimDetails(p)
    );
  }

  public async getAllByPartner(params: ApiParams<{ partnerId: string }>) {
    const { partnerId } = params;
    const query = new GetAllClaimDetailsByPartner(partnerId);
    return contextProvider.start(params).runQuery(query);
  }

  public async get(params: ApiParams<ClaimDetailKey>) {
    const query = new GetClaimDetailsQuery(params.projectId, params.partnerId, params.periodId, params.costCategoryId);
    return contextProvider.start(params).runQuery(query);
  }

  public async saveClaimDetails(params: ApiParams<ClaimDetailKey & { claimDetails: ClaimDetailsDto }>): Promise<ClaimDetailsDto> {
    const { projectId, partnerId, costCategoryId, periodId, claimDetails } = params;
    const context = contextProvider.start(params);
    const saveLineItemsCommand = new SaveClaimDetails(projectId, partnerId, periodId, costCategoryId, claimDetails);
    await context.runCommand(saveLineItemsCommand);

    const claimDetailsQuery = new GetClaimDetailsQuery(projectId, partnerId, periodId, costCategoryId);
    return context.runQuery(claimDetailsQuery);
  }
}

export const controller = new Controller();
