import { ApiParams, ControllerBase } from "./controllerBase";
import contextProvider from "@server/features/common/contextProvider";
import { GetAllClaimDetailsByPartner, GetClaimDetailsQuery } from "@server/features/claimDetails";

export interface IClaimDetailsApi {
  getAllByPartner: (params: ApiParams<{ partnerId: string }>) => Promise<ClaimDetailsDto[]>;
  get: (params: ApiParams<ClaimDetailKey>) => Promise<ClaimDetailsDto>;
}

class Controller extends ControllerBase<ClaimDetailsDto> implements IClaimDetailsApi {
  constructor() {
    super("claim-details");

    this.getItems("/", (p, q) => ({ partnerId: q.partnerId, }), (p) => this.getAllByPartner(p));
    this.getItem("/:projectId/:partnerId/:periodId/:costCategoryId", (p) => ({ projectId: p.projectId,  partnerId: p.partnerId, periodId: parseInt(p.periodId, 10), costCategoryId: p.costCategoryId }), p => this.get(p));
  }

  public async getAllByPartner(params: ApiParams<{ partnerId: string }>) {
    const { partnerId } = params;
    const query = new GetAllClaimDetailsByPartner(partnerId);
    return contextProvider.start(params).runQuery(query);
  }

  public async get(params: ApiParams<ClaimDetailKey>) {
    const query = new GetClaimDetailsQuery(params.projectId, params.partnerId, params.periodId, params.costCategoryId);
    return contextProvider.start(params).runQuery(query);
  }
}

export const controller = new Controller();
