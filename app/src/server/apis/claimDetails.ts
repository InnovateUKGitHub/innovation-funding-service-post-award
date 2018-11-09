import { ApiParams, ControllerBase } from "./controllerBase";
import contextProvider from "../features/common/contextProvider";
import { GetAllClaimDetailsByPartner } from "../features/claimDetails";

export interface IClaimDetailsApi {
  getAllByPartner: (params: ApiParams<{ partnerId: string }>) => Promise<ClaimDetailsDto[]>;
}

class Controller extends ControllerBase<ClaimDetailsDto> implements IClaimDetailsApi {
  constructor() {
    super("claim-details");

    this.getItems("/", (p, q) => ({ partnerId: q.partnerId, }), (p) => this.getAllByPartner(p));
  }

  public async getAllByPartner(params: ApiParams<{ partnerId: string }>) {
    const { partnerId } = params;
    const query = new GetAllClaimDetailsByPartner(partnerId);
    return await contextProvider.start(params).runQuery(query);
  }
}

export const controller = new Controller();
