import {ControllerBase} from "./controllerBase";
import contextProvider from "../features/common/contextProvider";
import {GetAllClaimDetailsByPartner} from "../features/claims/claimDetails/getAllByPartnerQuery";
import {ClaimDetailsDto} from "../../ui/models";

export interface IClaimDetailsApi {
  getAllByPartner: (partnerId: string) => Promise<ClaimDetailsDto[]>;
}

class Controller extends ControllerBase<ClaimDetailsDto> implements IClaimDetailsApi {
  constructor() {
    super("claim-details");

    this.getItems("/", (p, q) => ({ partnerId: q.partnerId, }), p => this.getAllByPartner(p.partnerId));
  }

  public async getAllByPartner(partnerId: string) {
    const query = new GetAllClaimDetailsByPartner(partnerId);
    return await contextProvider.start().runQuery(query);
  }
}

export const controller = new Controller();
