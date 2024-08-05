import { ClaimDto } from "@framework/dtos/claimDto";
import { ApiParams, ControllerBase } from "@server/apis/controllerBase";
import { GetClaimByPartnerIdAndPeriod } from "@server/features/claims/GetClaimByPartnerIdAndPeriod";
import { UpdateClaimCommand } from "@server/features/claims/updateClaim";
import { contextProvider } from "@server/features/common/contextProvider";
import { BadRequestError } from "@shared/appError";
import { processDto } from "@shared/processResponse";

export interface IClaimsApi<Context extends "client" | "server"> {
  update(
    params: ApiParams<
      Context,
      { projectId: ProjectId; partnerId: PartnerId; periodId: number; claim: ClaimDto; isClaimSummary: boolean }
    >,
  ): Promise<ClaimDto>;
}

class ClaimController extends ControllerBase<"server", ClaimDto> implements IClaimsApi<"server"> {
  constructor() {
    super("claims");

    this.putItem(
      "/:projectId/:partnerId/:periodId",
      (p, q, b) => ({
        projectId: p.projectId,
        partnerId: p.partnerId,
        periodId: parseInt(p.periodId, 10) as PeriodId,
        claim: processDto(b),
        isClaimSummary: q.isClaimSummary === "true",
      }),
      this.update,
    );
  }

  public async update(
    params: ApiParams<
      "server",
      { projectId: ProjectId; partnerId: PartnerId; periodId: PeriodId; claim: ClaimDto; isClaimSummary: boolean }
    >,
  ): Promise<ClaimDto> {
    const { projectId, partnerId, periodId, claim, isClaimSummary } = params;

    if (partnerId !== claim.partnerId || periodId !== claim.periodId) {
      throw new BadRequestError();
    }

    const context = contextProvider.start(params);
    const command = new UpdateClaimCommand(projectId, claim, isClaimSummary);
    await context.runCommand(command);

    const query = new GetClaimByPartnerIdAndPeriod(partnerId, periodId);
    return context.runQuery(query);
  }
}

export const controller = new ClaimController();
