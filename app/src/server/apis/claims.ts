import { ApiParams, ControllerBase } from "./controllerBase";
import contextProvider from "../features/common/contextProvider";
import { GetAllClaimsForProjectQuery, GetAllForPartnerQuery, GetClaim } from "../features/claims";
import { UpdateClaimCommand } from "../features/claims/updateClaim";
import { ApiError, StatusCode } from "./ApiError";
import { processDto } from "../../shared/processResponse";
import { ClaimDto } from "../../types";

export interface IClaimsApi {
  getAllByProjectId: (params: ApiParams<{ projectId: string }>) => Promise<ClaimDto[]>;
  getAllByPartnerId: (params: ApiParams<{ partnerId: string }>) => Promise<ClaimDto[]>;
  get: (params: ApiParams<{ partnerId: string, periodId: number }>) => Promise<ClaimDto | null>;
  update: (params: ApiParams<{ partnerId: string, periodId: number, claim: ClaimDto }>) => Promise<ClaimDto>;
}

class Controller extends ControllerBase<ClaimDto> implements IClaimsApi {

  constructor() {
    super("claims");

    this.getItems("/",
      (p, q) => ({ partnerId: q.partnerId as string, projectId: q.projectId as string }),
      (p) => {
        if (p.partnerId) {
          return this.getAllByPartnerId(p);
        }
        if (p.projectId) {
          return this.getAllByProjectId(p);
        }
        return Promise.reject(new ApiError(StatusCode.BAD_REQUEST, "Invalid parameters"));
      });
    this.getItem("/:partnerId/:periodId", (p) => ({ partnerId: p.partnerId as string, periodId: parseInt(p.periodId, 10) }), (p) => this.get(p));
    this.putItem("/:partnerId/:periodId", (p, q, b) => ({ partnerId: p.partnerId as string, periodId: parseInt(p.periodId, 10), claim: processDto(b) }), (p) => this.update(p));
  }

  public async getAllByProjectId(params: ApiParams<{ projectId: string; }>) {
    const query = new GetAllClaimsForProjectQuery(params.projectId);
    return await contextProvider.start(params).runQuery(query);
  }

  public async getAllByPartnerId(params: ApiParams<{ partnerId: string }>) {
    const query = new GetAllForPartnerQuery(params.partnerId);
    return await contextProvider.start(params).runQuery(query);
  }

  public async get(params: ApiParams<{ partnerId: string, periodId: number }>) {
    const { partnerId, periodId } = params;
    const query = new GetClaim(partnerId, periodId);
    return await contextProvider.start(params).runQuery(query);
  }

  public async update(params: ApiParams<{ partnerId: string, periodId: number, claim: ClaimDto }>) {
    const { partnerId, periodId, claim } = params;

    if (partnerId !== claim.partnerId || periodId !== claim.periodId) {
      throw new ApiError(StatusCode.BAD_REQUEST, "Bad request");
    }

    const context = contextProvider.start(params);
    const command = new UpdateClaimCommand(claim);
    await context.runCommand(command);

    const query = new GetClaim(partnerId, periodId);
    return context.runQuery(query);
  }
}

export const controller = new Controller();
