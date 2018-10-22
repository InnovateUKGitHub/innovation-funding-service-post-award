import {ControllerBase} from "./controllerBase";
import {ClaimDto} from "../../ui/models/claimDto";
import contextProvider from "../features/common/contextProvider";
import {GetAllForPartnerQuery, GetClaim} from "../features/claims";
import {UpdateClaimCommand} from "../features/claims/updateClaim";
import {ApiError, StatusCode} from "./ApiError";
import {processDto} from "../../shared/processResponse";

export interface IClaimsApi {
  getAllByPartnerId: (partnerId: string) => Promise<ClaimDto[]>;
  get: (partnerId: string, periodId: number) => Promise<ClaimDto|null>;
  update: (partnerId: string, periodId: number, claim: ClaimDto) => Promise<ClaimDto>;
}

class Controller extends ControllerBase<ClaimDto> implements IClaimsApi {

  constructor() {
    super("claims");

    this.getItems("/", (p, q) => ({partnerId: q.partnerId}), (p) => this.getAllByPartnerId(p.partnerId));
    this.getItem("/:partnerId/:periodId", (p) => ({partnerId: p.partnerId as string, periodId: parseInt(p.periodId, 10)}), (p) => this.get(p.partnerId, p.periodId));
    this.putItem("/:partnerId/:periodId", (p, q, b) => ({partnerId: p.partnerId as string, periodId: parseInt(p.periodId, 10), claim: processDto(b)}), (p) => this.update(p.partnerId, p.periodId, p.claim));
  }

  public async getAllByPartnerId(partnerId: string) {
    const query = new GetAllForPartnerQuery(partnerId);
    return await contextProvider.start().runQuery(query);
  }

  public async get(partnerId: string, periodId: number) {
    const query = new GetClaim(partnerId, periodId);
    return await contextProvider.start().runQuery(query);
  }

  public async update(partnerId: string, periodId: number, claim: ClaimDto) {
    if (partnerId !== claim.partnerId || periodId !== claim.periodId) {
      throw new ApiError(StatusCode.BAD_REQUEST, "Bad request");
    }

    const context = contextProvider.start();
    const command = new UpdateClaimCommand(claim);
    await context.runCommand(command);

    const query = new GetClaim(partnerId, periodId);
    // TODO - linked to getClaim query todo about nulls and exceptions
    return context.runQuery(query).then(x => x!);
  }
}

export const controller = new Controller();
