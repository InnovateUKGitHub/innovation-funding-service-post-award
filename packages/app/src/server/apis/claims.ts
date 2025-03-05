import { ClaimDto, ClaimUpdateForecastDto } from "@framework/dtos/claimDto";
import { ApiParams, ControllerBase } from "@server/apis/controllerBase";
import { GetClaimByPartnerIdAndPeriod } from "@server/features/claims/GetClaimByPartnerIdAndPeriod";
import { UpdateClaimCommand } from "@server/features/claims/updateClaim";
import { UpdateClaimForecastCommand } from "@server/features/claims/updateClaimForecastCommand";
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

  updateForecast(
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        partnerId: PartnerId;
        periodId: number;
        claim: ClaimUpdateForecastDto;
      }
    >,
  ): Promise<boolean>;
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

    this.putItem(
      "/:projectId/:partnerId/:periodId/update-claim-forecast",
      (p, q, b) => ({
        projectId: p.projectId,
        partnerId: p.partnerId,
        periodId: parseInt(p.periodId, 10) as PeriodId,
        claim: processDto(b),
        // isClaimSummary: q.isClaimSummary === "true",
      }),
      this.updateForecast,
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

    const context = await contextProvider.start(params);
    const command = new UpdateClaimCommand(projectId, claim, isClaimSummary);
    await context.runCommand(command);

    const query = new GetClaimByPartnerIdAndPeriod(partnerId, periodId);
    return context.runQuery(query);
  }

  public async updateForecast(
    params: ApiParams<
      "server",
      {
        projectId: ProjectId;
        partnerId: PartnerId;
        periodId: PeriodId;
        claim: ClaimUpdateForecastDto;
      }
    >,
  ): Promise<boolean> {
    const { projectId, partnerId, periodId, claim } = params;

    const context = await contextProvider.start(params);
    const command = new UpdateClaimForecastCommand(projectId, partnerId, periodId, claim);
    await context.runCommand(command);

    return true;
  }
}

export const controller = new ClaimController();
