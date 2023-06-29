import { TotalCosts } from "@framework/constants/claims";
import { ClaimDto, ClaimStatusChangeDto } from "@framework/dtos/claimDto";
import { ApiParams, ControllerBase } from "@server/apis/controllerBase";
import { GetAllClaimsForProjectQuery } from "@server/features/claims/getAllClaimsForProjectQuery";
import { GetAllForPartnerQuery } from "@server/features/claims/getAllForPartnerQuery";
import { GetAllIncludingNewForPartnerQuery } from "@server/features/claims/getAllIncludingNewForPartnerQuery";
import { GetClaim } from "@server/features/claims/getClaim";
import { GetClaimStatusChangesQuery } from "@server/features/claims/getClaimStatusChangesQuery";
import { GetClaimsTotalCosts } from "@server/features/claims/getClaimsTotalCosts";
import { UpdateClaimCommand } from "@server/features/claims/updateClaim";
import { contextProvider } from "@server/features/common/contextProvider";
import { BadRequestError } from "@shared/appError";
import { processDto } from "@shared/processResponse";

export interface IClaimsApi<Context extends "client" | "server"> {
  getAllByProjectId(params: ApiParams<Context, { projectId: ProjectId }>): Promise<ClaimDto[]>;
  getAllByPartnerId(params: ApiParams<Context, { partnerId: PartnerId }>): Promise<ClaimDto[]>;
  getAllIncludingNewByPartnerId(params: ApiParams<Context, { partnerId: PartnerId }>): Promise<ClaimDto[]>;
  get(params: ApiParams<Context, { partnerId: PartnerId; periodId: number }>): Promise<ClaimDto>;
  update(
    params: ApiParams<Context, { projectId: ProjectId; partnerId: PartnerId; periodId: number; claim: ClaimDto }>,
  ): Promise<ClaimDto>;
  getStatusChanges(
    params: ApiParams<Context, { projectId: ProjectId; partnerId: PartnerId; periodId: number }>,
  ): Promise<ClaimStatusChangeDto[]>;
  getTotalCosts(
    params: ApiParams<Context, { partnerId: PartnerId; projectId: ProjectId; periodId: number }>,
  ): Promise<TotalCosts>;
}

class ClaimController extends ControllerBase<"server", ClaimDto> implements IClaimsApi<"server"> {
  constructor() {
    super("claims");

    this.getCustom(
      "/:projectId/:partnerId/:periodId/total-costs",
      p => ({
        projectId: p.projectId,
        partnerId: p.partnerId,
        periodId: parseInt(p.periodId, 10) as PeriodId,
      }),
      this.getTotalCosts,
    );

    this.getCustom(
      "/:projectId/:partnerId/:periodId/status-changes",
      p => ({
        projectId: p.projectId,
        partnerId: p.partnerId,
        periodId: parseInt(p.periodId, 10) as PeriodId,
      }),
      p => this.getStatusChanges(p),
    );

    this.getItems(
      "/",
      (p, q) => ({ partnerId: q.partnerId, projectId: q.projectId }),
      p => {
        if (p.partnerId) {
          return this.getAllByPartnerId(p);
        }

        if (p.projectId) {
          return this.getAllByProjectId(p);
        }

        return Promise.reject(new BadRequestError("Invalid parameters"));
      },
    );

    this.getItems(
      "/getAllIncludingNew/",
      (p, q) => ({ partnerId: q.partnerId }),
      p => {
        if (p.partnerId) {
          return this.getAllIncludingNewByPartnerId(p);
        }
        return Promise.reject(new BadRequestError("Invalid parameters"));
      },
    );

    this.getItem(
      "/:partnerId/:periodId",
      p => ({ partnerId: p.partnerId, periodId: parseInt(p.periodId, 10) as PeriodId }),
      this.get,
    );

    this.putItem(
      "/:projectId/:partnerId/:periodId",
      (p, q, b) => ({
        projectId: p.projectId,
        partnerId: p.partnerId,
        periodId: parseInt(p.periodId, 10) as PeriodId,
        claim: processDto(b),
      }),
      this.update,
    );
  }

  public async getAllByProjectId(params: ApiParams<"server", { projectId: ProjectId }>): Promise<ClaimDto[]> {
    const query = new GetAllClaimsForProjectQuery(params.projectId);
    return contextProvider.start(params).runQuery(query);
  }

  public async getAllByPartnerId(params: ApiParams<"server", { partnerId: PartnerId }>): Promise<ClaimDto[]> {
    const query = new GetAllForPartnerQuery(params.partnerId);
    return contextProvider.start(params).runQuery(query);
  }

  public async getAllIncludingNewByPartnerId(
    params: ApiParams<"server", { partnerId: PartnerId }>,
  ): Promise<ClaimDto[]> {
    const query = new GetAllIncludingNewForPartnerQuery(params.partnerId);
    return contextProvider.start(params).runQuery(query);
  }

  public async get(params: ApiParams<"server", { partnerId: PartnerId; periodId: PeriodId }>): Promise<ClaimDto> {
    const { partnerId, periodId } = params;
    const query = new GetClaim(partnerId, periodId);
    return contextProvider.start(params).runQuery(query);
  }

  public async update(
    params: ApiParams<"server", { projectId: ProjectId; partnerId: PartnerId; periodId: PeriodId; claim: ClaimDto }>,
  ): Promise<ClaimDto> {
    const { projectId, partnerId, periodId, claim } = params;

    if (partnerId !== claim.partnerId || periodId !== claim.periodId) {
      throw new BadRequestError();
    }

    const context = contextProvider.start(params);
    const command = new UpdateClaimCommand(projectId, claim);
    await context.runCommand(command);

    const query = new GetClaim(partnerId, periodId);
    return context.runQuery(query);
  }

  public async getStatusChanges(
    params: ApiParams<"server", { projectId: ProjectId; partnerId: PartnerId; periodId: PeriodId }>,
  ): Promise<ClaimStatusChangeDto[]> {
    const query = new GetClaimStatusChangesQuery(params.projectId, params.partnerId, params.periodId);
    return contextProvider.start(params).runQuery(query);
  }

  public async getTotalCosts(
    params: ApiParams<"server", { partnerId: PartnerId; projectId: ProjectId; periodId: PeriodId }>,
  ): Promise<TotalCosts> {
    const query = new GetClaimsTotalCosts(params.partnerId, params.projectId, params.periodId);
    return contextProvider.start(params).runQuery(query);
  }
}

export const controller = new ClaimController();
