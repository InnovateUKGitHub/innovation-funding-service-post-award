import { ApiParams, ControllerBase } from "./controllerBase";
import contextProvider from "../features/common/contextProvider";
import { GetAllClaimsForProjectQuery, GetAllForPartnerQuery, GetClaim } from "../features/claims";
import { UpdateClaimCommand } from "../features/claims/updateClaim";
import { processDto } from "../../shared/processResponse";
import { ClaimDto } from "../../types";
import { BadRequestError } from "../features/common/appError";

export interface IClaimsApi {
  getAllByProjectId: (params: ApiParams<{ projectId: string }>) => Promise<ClaimDto[]>;
  getAllByPartnerId: (params: ApiParams<{ partnerId: string }>) => Promise<ClaimDto[]>;
  get: (params: ApiParams<{ partnerId: string, periodId: number }>) => Promise<ClaimDto | null>;
  update: (params: ApiParams<{ projectId: string, partnerId: string, periodId: number, claim: ClaimDto }>) => Promise<ClaimDto>;
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
        return Promise.reject(new BadRequestError("Invalid parameters"));
      });
    this.getItem("/:partnerId/:periodId", (p) => ({ partnerId: p.partnerId as string, periodId: parseInt(p.periodId, 10) }), (p) => this.get(p));
    this.putItem("/:projectId/:partnerId/:periodId", (p, q, b) => ({ projectId: p.projectId, partnerId: p.partnerId, periodId: parseInt(p.periodId, 10), claim: processDto(b) }), (p) => this.update(p));
  }

  public async getAllByProjectId(params: ApiParams<{ projectId: string; }>) {
    const query = new GetAllClaimsForProjectQuery(params.projectId);
    return contextProvider.start(params).runQuery(query);
  }

  public async getAllByPartnerId(params: ApiParams<{ partnerId: string }>) {
    const query = new GetAllForPartnerQuery(params.partnerId);
    return contextProvider.start(params).runQuery(query);
  }

  public async get(params: ApiParams<{ partnerId: string, periodId: number }>) {
    const { partnerId, periodId } = params;
    const query = new GetClaim(partnerId, periodId);
    return contextProvider.start(params).runQuery(query);
  }

  public async update(params: ApiParams<{ projectId: string, partnerId: string, periodId: number, claim: ClaimDto }>) {
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
}

export const controller = new Controller();
