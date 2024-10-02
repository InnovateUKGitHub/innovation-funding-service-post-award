import { IContext } from "@framework/types/IContext";
import { UpdateClaimCommand } from "@server/features/claims/updateClaim";
import { ClaimStatus } from "@framework/constants/claimStatus";
import { ProjectMonitoringLevel, ProjectRole } from "@framework/constants/project";
import { ClaimDto } from "@framework/dtos/claimDto";
import { GetClaimByPartnerIdAndPeriod } from "@server/features/claims/GetClaimByPartnerIdAndPeriod";
import { GetByIdQuery } from "@server/features/projects/getDetailsByIdQuery";
import { GetAllProjectRolesForUser } from "@server/features/projects/getAllProjectRolesForUser";
import { AllClaimsDashboardRoute } from "@ui/pages/claims/allClaimsDashboard/allClaimsDashboard.page";
import { ClaimsDashboardRoute } from "@ui/pages/claims/claimDashboard.page";
import { ClaimSummaryParams, ClaimSummaryRoute } from "@ui/pages/claims/claimSummary.page";
import { PrepareClaimParams } from "@ui/pages/claims/claimPrepare.page";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { claimSummaryErrorMap, ClaimSummarySchemaType, getClaimSummarySchema } from "@ui/pages/claims/claimSummary.zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { GetCostsSummaryForPeriodQuery } from "@server/features/claimDetails/getCostsSummaryForPeriodQuery";
import { ProjectDto } from "@framework/dtos/projectDto";
import { CostsSummaryForPeriodDto } from "@framework/dtos/costsSummaryForPeriodDto";
import { GetClaimDocumentsQuery } from "@server/features/documents/getClaimDocumentsSummary";

export class ClaimSummaryFormHandler extends ZodFormHandlerBase<ClaimSummarySchemaType, ClaimSummaryParams> {
  private project: ProjectDto | undefined;
  private claim: ClaimDto | undefined;
  private claimDetails: CostsSummaryForPeriodDto[] | undefined;

  constructor() {
    super({
      routes: [ClaimSummaryRoute],
      forms: [FormTypes.ClaimSummary],
    });
  }

  public readonly acceptFiles = false;

  private async safeGet(context: IContext, params: ClaimSummaryParams, field: "project" | "claim") {
    if (field === "project") {
      if (!this.project) {
        this.project = await context.runQuery(new GetByIdQuery(params.projectId));
      }
      return this.project;
    }

    if (field === "claim") {
      if (!this.claim) {
        this.claim = await context.runQuery(new GetClaimByPartnerIdAndPeriod(params.partnerId, params.periodId));
      }
      return this.claim;
    }
  }

  public async getZodSchema({ params, context }: { params: ClaimSummaryParams; context: IContext }) {
    this.claim = await context.runQuery(new GetClaimByPartnerIdAndPeriod(params.partnerId, params.periodId));

    this.project = await context.runQuery(new GetByIdQuery(params.projectId));

    this.claimDetails = await context.runQuery(
      new GetCostsSummaryForPeriodQuery(params.projectId, params.partnerId, params.periodId),
    );

    return {
      schema: getClaimSummarySchema({ claim: this.claim, project: this.project, claimDetails: this.claimDetails }),
      errorMap: claimSummaryErrorMap,
    };
  }

  protected async mapToZod({
    input,
    params,
    context,
  }: {
    input: AnyObject;
    params: ClaimSummaryParams;
    context: IContext;
  }): Promise<z.input<ClaimSummarySchemaType>> {
    if (!this.claim) {
      this.claim = await context.runQuery(new GetClaimByPartnerIdAndPeriod(params.partnerId, params.periodId));
    }

    const documents = await context.runQuery(
      new GetClaimDocumentsQuery({
        partnerId: params.partnerId,
        periodId: params.periodId,
        projectId: params.projectId,
      }),
    );

    return {
      form: input.form,
      button_submit: input.button_submit,
      comments: input.comments,
      status: this.claim.status,
      documents,
    };
  }

  protected async getDto(
    context: IContext,
    params: PrepareClaimParams,
    input: z.output<ClaimSummarySchemaType>,
  ): Promise<ClaimDto> {
    if (!this.claim) {
      this.claim = await context.runQuery(new GetClaimByPartnerIdAndPeriod(params.partnerId, params.periodId));
    }

    this.claim.comments = input.comments ?? null;

    // Note: Not submitted so we only care about comments being updated
    if (input.button_submit !== "submit") return this.claim;

    if (!this.project) {
      this.project = await context.runQuery(new GetByIdQuery(params.projectId));
    }

    switch (this.claim.status) {
      case ClaimStatus.DRAFT:
      case ClaimStatus.MO_QUERIED:
        if (this.project.monitoringLevel === ProjectMonitoringLevel.InternalAssurance) {
          this.claim.status = ClaimStatus.AWAITING_IUK_APPROVAL;
        } else {
          this.claim.status = ClaimStatus.SUBMITTED;
        }
        break;

      case ClaimStatus.AWAITING_IAR:
      case ClaimStatus.INNOVATE_QUERIED:
        this.claim.status = ClaimStatus.AWAITING_IUK_APPROVAL;
        break;
    }

    return this.claim;
  }

  protected async run({
    input,
    context,
    params,
  }: {
    context: IContext;
    params: PrepareClaimParams;
    input: z.output<ClaimSummarySchemaType>;
  }): Promise<string> {
    const dto = await this.getDto(context, params, input);

    await context.runCommand(new UpdateClaimCommand(params.projectId, dto, true));

    // if pm as well as fc then go to all claims route
    const roles = await context.runQuery(new GetAllProjectRolesForUser()).then(x => x.forProject(params.projectId));
    if (roles.hasRole(ProjectRole.ProjectManager)) {
      return AllClaimsDashboardRoute.getLink(params).path;
    }

    return ClaimsDashboardRoute.getLink(params).path;
  }
}
