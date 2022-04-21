import { ClaimDto, ClaimStatusChangeDto, TotalCosts } from "@framework/types";

import { processDto } from "@shared/processResponse";
import { BadRequestError } from "@server/features/common";
import { contextProvider } from "@server/features/common/contextProvider";

import { ApiParams, ControllerBase } from "@server/apis/controllerBase";
import {
  GetClaimStatusChangesQuery,
  GetClaimsTotalCosts,
  GetAllClaimsForProjectQuery,
  GetAllForPartnerQuery,
  GetClaim,
  UpdateClaimCommand,
} from "@server/features/claims";

class ClaimController extends ControllerBase<ClaimDto> implements IClaimsApi {
  constructor() {
    super("claims");

    this.getCustom(
      "/:projectId/:partnerId/:periodId/total-costs",
      p => ({
        projectId: p.projectId,
        partnerId: p.partnerId,
        periodId: parseInt(p.periodId, 10),
      }),
      this.getTotalCosts,
    );

    this.getCustom(
      "/:projectId/:partnerId/:periodId/status-changes",
      // eslint-disable-next-line sonarjs/no-identical-functions
      p => ({
        projectId: p.projectId,
        partnerId: p.partnerId,
        periodId: parseInt(p.periodId, 10),
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

    this.getItem(
      "/:partnerId/:periodId",
      p => ({ partnerId: p.partnerId, periodId: parseInt(p.periodId, 10) }),
      this.get,
    );

    this.putItem(
      "/:projectId/:partnerId/:periodId",
      (p, q, b) => ({
        projectId: p.projectId,
        partnerId: p.partnerId,
        periodId: parseInt(p.periodId, 10),
        claim: processDto(b),
      }),
      this.update,
    );
  }

  public async getAllByProjectId(params: ApiParams<{ projectId: string }>): Promise<ClaimDto[]> {
    const query = new GetAllClaimsForProjectQuery(params.projectId);
    return contextProvider.start(params).runQuery(query);
  }

  public async getAllByPartnerId(params: ApiParams<{ partnerId: string }>): Promise<ClaimDto[]> {
    const query = new GetAllForPartnerQuery(params.partnerId);
    return contextProvider.start(params).runQuery(query);
  }

  public async get(params: ApiParams<{ partnerId: string; periodId: number }>): Promise<ClaimDto> {
    const { partnerId, periodId } = params;
    const query = new GetClaim(partnerId, periodId);
    return contextProvider.start(params).runQuery(query);
  }

  public async update(
    params: ApiParams<{ projectId: string; partnerId: string; periodId: number; claim: ClaimDto }>,
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
    params: ApiParams<{ projectId: string; partnerId: string; periodId: number }>,
  ): Promise<ClaimStatusChangeDto[]> {
    const query = new GetClaimStatusChangesQuery(params.projectId, params.partnerId, params.periodId);
    return contextProvider.start(params).runQuery(query);
  }

  public async getTotalCosts(
    params: ApiParams<{ partnerId: string; projectId: string; periodId: number }>,
  ): Promise<TotalCosts> {
    const query = new GetClaimsTotalCosts(params.partnerId, params.projectId, params.periodId);
    return contextProvider.start(params).runQuery(query);
  }
}

export const controller = new ClaimController();

export type IClaimsApi = Pick<
  ClaimController,
  "getAllByProjectId" | "getAllByPartnerId" | "get" | "update" | "getStatusChanges" | "getTotalCosts"
>;
