import { ProjectRolePermissionBits } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { ClaimReviewDto } from "@framework/dtos/claimDto";
import {
  claimReviewErrorMap,
  claimReviewSchema,
  ClaimReviewSchemaType,
} from "@ui/pages/claims/claimReview/claimReview.zod";
import { ClaimStatus } from "@framework/constants/claimStatus";

export class UpdateClaimReviewCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  ClaimReviewSchemaType,
  ClaimReviewDto
> {
  public readonly runnableName: string = "UpdateClaimReviewCommand";
  protected readonly projectId: ProjectId;
  private readonly partnerId: PartnerId;
  private readonly periodId: PeriodId;
  protected readonly dto: ClaimReviewDto;

  constructor(projectId: ProjectId, partnerId: PartnerId, periodId: PeriodId, dto: ClaimReviewDto) {
    super();
    this.projectId = projectId;
    this.partnerId = partnerId;
    this.periodId = periodId;
    this.dto = dto;
  }

  async accessControl(auth: Authorisation) {
    const hasMoRole = auth.forProject(this.projectId).hasRole(ProjectRolePermissionBits.MonitoringOfficer);
    const hasFcRole = auth
      .forPartner(this.projectId, this.partnerId)
      .hasRole(ProjectRolePermissionBits.FinancialContact);

    return hasMoRole || hasFcRole;
  }

  protected async getZodSchema() {
    return { schema: claimReviewSchema, errorMap: claimReviewErrorMap };
  }

  protected async mapToZod() {
    return {
      form: this.dto.form,
      claimId: this.dto.claimId,
      status: this.dto.status,
      comments: this.dto.comments,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<ClaimReviewSchemaType>,
  ): Promise<boolean> {
    await Promise.all([
      context.repositories.claims.update({
        Id: validatedData.claimId,
        Acc_ClaimStatus__c: validatedData.status,
        Acc_ReasonForDifference__c: "",
      }),

      context.repositories.claimStatusChanges.create({
        Acc_Claim__c: validatedData.claimId,
        Acc_ExternalComment__c: validatedData.comments,
        Acc_ParticipantVisibility__c: validatedData.status === ClaimStatus.MO_QUERIED,
      }),
    ]);

    return true;
  }
}
