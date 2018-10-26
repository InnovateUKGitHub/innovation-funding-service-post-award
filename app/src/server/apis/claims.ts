import {ControllerBase, ApiParams} from "./controllerBase";
import {ClaimDto} from "../../ui/models/claimDto";
import contextProvider from "../features/common/contextProvider";
import {GetAllForPartnerQuery, GetClaim} from "../features/claims";
import {UpdateClaimCommand} from "../features/claims/updateClaim";
import {ApiError, StatusCode} from "./ApiError";
import {processDto} from "../../shared/processResponse";

export interface IClaimsApi {
  getAllByPartnerId: (params: ApiParams<{partnerId: string}>) => Promise<ClaimDto[]>;
  get: (params: ApiParams<{partnerId: string, periodId: number}>) => Promise<ClaimDto|null>;
  update: (params: ApiParams<{partnerId: string, periodId: number, claim: ClaimDto}>) => Promise<ClaimDto>;
}

class Controller extends ControllerBase<ClaimDto> implements IClaimsApi {

  constructor() {
    super("claims");

    this.getItems("/", (p, q) => ({partnerId: q.partnerId}),  (p) => this.getAllByPartnerId(p));
    this.getItem("/:partnerId/:periodId", (p) => ({partnerId: p.partnerId as string, periodId: parseInt(p.periodId, 10)}),  (p) => this.get(p));
    this.putItem("/:partnerId/:periodId", (p, q, b) => ({partnerId: p.partnerId as string, periodId: parseInt(p.periodId, 10), claim: processDto(b)}),  (p) => this.update(p));
  }

  public async getAllByPartnerId(params: ApiParams<{partnerId: string}>) {
    const query = new GetAllForPartnerQuery(params.partnerId);
    return await contextProvider.start(params.user).runQuery(query);
  }

  public async get(params: ApiParams<{partnerId: string, periodId: number}>) {
    const {partnerId, periodId, user} = params;
    const query = new GetClaim(partnerId, periodId);
    return await contextProvider.start(user).runQuery(query);
  }

  public async update(params: ApiParams<{partnerId: string, periodId: number, claim: ClaimDto}>) {
    const {partnerId, periodId, claim, user} = params;

    if (partnerId !== claim.partnerId || periodId !== claim.periodId) {
      throw new ApiError(StatusCode.BAD_REQUEST, "Bad request");
    }

    const context = contextProvider.start(user);
    const command = new UpdateClaimCommand(claim);
    await context.runCommand(command);

    const query = new GetClaim(partnerId, periodId);
    // TODO - linked to getClaim query todo about nulls and exceptions
    return context.runQuery(query).then(x => x!);
  }
}

export const controller = new Controller();
