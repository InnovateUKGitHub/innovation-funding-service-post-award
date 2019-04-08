import { ApiParams, ControllerBase } from "./controllerBase";
import contextProvider from "../features/common/contextProvider";
import { GetAllClaimDetailsByPartner } from "../features/claimDetails";
import { GetClaimDetailsQuery } from "../features/claimDetails/getClaimDetailsQuery";

export interface IClaimDetailsApi {
  getAllByPartner: (params: ApiParams<{ partnerId: string }>) => Promise<ClaimDetailsDto[]>;
  get: (params: ApiParams<{ partnerId: string, periodId: number, costCategoryId: string }>) => Promise<ClaimDetailsDto>;
}

class Controller extends ControllerBase<ClaimDetailsDto> implements IClaimDetailsApi {
  constructor() {
    super("claim-details");

    this.getItems("/", (p, q) => ({ partnerId: q.partnerId, }), (p) => this.getAllByPartner(p));
    this.getItem("/:partnerId/:periodId/:costCategoryId", (p, q) => ({ partnerId: p.partnerId, periodId: parseInt(p.periodId, 10), costCategoryId: p.costCategoryId }), p => this.get(p));
  }

  public async getAllByPartner(params: ApiParams<{ partnerId: string }>) {
    const { partnerId } = params;
    const query = new GetAllClaimDetailsByPartner(partnerId);
    return contextProvider.start(params).runQuery(query);
  }

  public async get(params: ApiParams<{ partnerId: string, periodId: number, costCategoryId: string }>) {
    const query = new GetClaimDetailsQuery(params.partnerId, params.periodId, params.costCategoryId);
    return contextProvider.start(params).runQuery(query);
  }
}

export const controller = new Controller();
