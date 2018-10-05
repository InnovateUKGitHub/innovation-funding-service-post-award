import {ControllerBase} from "./controllerBase";
import contextProvider from "../features/common/contextProvider";
import {GetAllClaimDetailsByPartner} from "../features/claims/claimDetails/getAllByPartnerQuery";
import {ClaimDetailsDtoNew} from "../../ui/models";
import {ApiError, ErrorCode} from "./ApiError";

export interface IClaimDetailsApi {
  getAllByPartner: (partnerId: string, periodId: number) => Promise<ClaimDetailsDtoNew[]>;
}

export interface Params {
  partnerId: string;
}

class Controller extends ControllerBase<ClaimDetailsDtoNew> implements IClaimDetailsApi {
  public path = "claimdetails";

  constructor() {
    super();

    this.getItems("/", (p, q) => ({
      partnerId: q.partnerId,
    }),  p => this.delegateRequest(p));
  }

  private async delegateRequest(p: Params) {
    if (!p.partnerId) {
      throw new ApiError(ErrorCode.BAD_REQUEST, "Bad request");
    }
    return this.getAllByPartner(p.partnerId);
  }

  public async getAllByPartner(partnerId: string) {
    const query = new GetAllClaimDetailsByPartner(partnerId);
    return await contextProvider.start().runQuery(query);
  }
}

export const controller = new Controller();
