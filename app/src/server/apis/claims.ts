import {ControllerBase} from "./controllerBase";
import {ClaimDto} from "../../ui/models/claimDto";
import contextProvider from "../features/common/contextProvider";
import {GetAllForPartnerQuery, GetByIdQuery} from "../features/claims";
import {UpdateClaimCommand} from "../features/claims/updateClaim";
import {DateTime} from "luxon";
import {ApiError, ErrorCode} from "./ApiError";

export interface IClaimsApi {
  getAllByPartnerId: (projectId: string) => Promise<ClaimDto[]>;
  getById: (claimId: string) => Promise<ClaimDto>;
}

interface IClaimBody {
  id: string;
  partnerId: string;
  lastModifiedDate: string;
  status: string;
  periodStartDate: string;
  periodEndDate: string;
  periodId: number;
  totalCost: number;
  forecastCost: number;
  approvedDate: string | null;
  paidDate: string | null;
  comments: string | null;
}

const mapBodyToDto = (body: IClaimBody): ClaimDto => {
  return {
    id: body.id,
    partnerId: body.partnerId,
    lastModifiedDate: DateTime.fromISO(body.lastModifiedDate).toLocal().toJSDate(),
    status: body.status,
    periodStartDate: DateTime.fromISO(body.periodStartDate).toLocal().toJSDate(),
    periodEndDate: DateTime.fromISO(body.periodEndDate).toLocal().toJSDate(),
    periodId: body.periodId,
    totalCost: body.totalCost,
    forecastCost: body.forecastCost,
    approvedDate: body.approvedDate ? DateTime.fromISO(body.approvedDate).toLocal().toJSDate() : null,
    paidDate: body.paidDate ? DateTime.fromISO(body.paidDate).toLocal().toJSDate() : null,
    comments: body.comments
  };
};

class Controller extends ControllerBase<ClaimDto> implements IClaimsApi {
  constructor() {
    super();

    this.getItems("/", (p, q) => ({partnerId: q.partnerId as string}), (p) => this.getAllByPartnerId(p.partnerId));
    this.getItem("/:claimId", (p, q) => ({claimId: p.claimId as string}), (p) => this.getById(p.claimId));
    this.putItem("/:claimId", (p, q, b) => ({ claimId: p.claimId as string, claim: mapBodyToDto(b) }), (p) => this.update(p.claimId, p.claim));
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
    return await contextProvider.start().runQuery(query).catch(e => {
      console.log("Api Error: ", e);
      throw new ApiError(ErrorCode.INTERNAL_SERVER_ERROR, "Failed to return updated claim");
    });
  }
}

export const controller = new Controller();
