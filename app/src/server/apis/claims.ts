import {ControllerBase} from "./controllerBase";
import {ClaimDto} from "../../ui/models/claimDto";
import contextProvider from "../features/common/contextProvider";
import {GetAllForPartnerQuery, GetByIdQuery} from "../features/claims";
import {UpdateClaimCommand} from "../features/claims/updateClaim";
import {ApiError, ErrorCode} from "./ApiError";
import {processDto} from "../../shared/processResponse";

export interface IClaimsApi {
  getAllByPartnerId: (projectId: string) => Promise<ClaimDto[]>;
  getById: (claimId: string) => Promise<ClaimDto>;
  update: (id: string, claim: ClaimDto) => Promise<ClaimDto>;
}

class Controller extends ControllerBase<ClaimDto> implements IClaimsApi {
  constructor() {
    super();

    this.getItems("/", (p, q) => ({partnerId: q.partnerId as string}), (p) => this.getAllByPartnerId(p.partnerId));
    this.getItem("/:claimId", (p) => ({claimId: p.claimId as string}), (p) => this.getById(p.claimId));
    this.putItem("/:claimId", (p, q, b) => ({ claimId: p.claimId as string, claim: processDto(b)}), (p) => this.update(p.claimId, p.claim));
  }

  public async getAllByPartnerId(partnerId: string) {
    const query = new GetAllForPartnerQuery(partnerId);
    return await contextProvider.start().runQuery(query);
  }

  public async getById(claimId: string) {
    const query = new GetByIdQuery(claimId);
    return await contextProvider.start().runQuery(query);
  }

  public async update(id: string, claim: ClaimDto) {
    if (id !== claim.id) {
      throw new ApiError(ErrorCode.BAD_REQUEST, "Bad request");
    }
    const command = new UpdateClaimCommand(claim);

    await contextProvider.start().runCommand(command).catch(e => {
      console.log("Api Error: ", e);
      throw new ApiError(ErrorCode.INTERNAL_SERVER_ERROR, "Failed to update claim");
    });

    const query = new GetByIdQuery(id);
    return await contextProvider.start().runQuery(query);
  }
}

export const controller = new Controller();
