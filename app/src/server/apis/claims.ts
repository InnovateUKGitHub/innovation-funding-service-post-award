import {ControllerBase} from "./controllerBase";
import {ClaimDto} from "../../ui/models/claimDto";
import contextProvider from "../features/common/contextProvider";
import {GetAllForPartnerQuery, GetByPartnerAndPeriodQuery} from "../features/claims";
import {UpdateClaimCommand} from "../features/claims/updateClaim";
import {ApiError, ErrorCode} from "./ApiError";
import {processDto} from "../../shared/processResponse";

export interface IClaimsApi {
  getAllByPartnerId: (partnerId: string) => Promise<ClaimDto[]>;
  getByPartnerAndPeriod: (partnerId: string, periodId: number) => Promise<ClaimDto|null>;
  update: (partnerId: string, periodId: number, claim: ClaimDto) => Promise<ClaimDto>;
}

class Controller extends ControllerBase<ClaimDto> implements IClaimsApi {
  constructor() {
    super();

    this.getItems("/:partnerId", (p, q) => ({partnerId: p.partnerId as string}), (p) => this.getAllByPartnerId(p.partnerId));
    this.getItem("/:partnerId/:periodId", (p) => ({partnerId: p.partnerId as string, periodId: parseInt(p.periodId, 10)}), (p) => this.getByPartnerAndPeriod(p.partnerId, p.periodId));
    this.putItem("/:partnerId/:periodId", (p, q, b) => ({partnerId: p.partnerId as string, periodId: parseInt(p.periodId, 10), claim: processDto(b)}), (p) => this.update(p.partnerId, p.periodId, p.claim));
  }

  public async getAllByPartnerId(partnerId: string) {
    const query = new GetAllForPartnerQuery(partnerId);
    return await contextProvider.start().runQuery(query);
  }

  public async getByPartnerAndPeriod(partnerId: string, periodId: number) {
    const query = new GetByPartnerAndPeriodQuery(partnerId, periodId);
    return await contextProvider.start().runQuery(query);
  }

  public async update(partnerId: string, periodId: number, claim: ClaimDto) {
    if (partnerId !== claim.partnerId || periodId !== claim.periodId) {
      throw new ApiError(ErrorCode.BAD_REQUEST, "Bad request");
    }

    const command = new UpdateClaimCommand(claim);

    await contextProvider.start().runCommand(command).catch(e => {
      console.log("Api Error: ", e);
      throw new ApiError(ErrorCode.INTERNAL_SERVER_ERROR, "Failed to update claim");
    });

    const query = new GetByPartnerAndPeriodQuery(partnerId, periodId);
    return (await contextProvider.start().runQuery(query))!;
  }
}

export const controller = new Controller();
