import { ProjectMonitoringLevel, ProjectRolePermissionBits } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { ClaimSummaryDto } from "@framework/dtos/claimDto";
import { ClaimSummarySchemaType, claimSummaryErrorMap, claimSummarySchema } from "@ui/pages/claims/claimSummary.zod";
import { ClaimStatus } from "@framework/constants/claimStatus";

export class UpdateClaimSummaryCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  ClaimSummarySchemaType,
  ClaimSummaryDto
> {
  public readonly runnableName: string = "UpdateClaimSummaryCommand";
  protected readonly projectId: ProjectId;
  private readonly partnerId: PartnerId;
  private readonly periodId: PeriodId;
  protected readonly dto: ClaimSummaryDto;

  constructor(projectId: ProjectId, partnerId: PartnerId, periodId: PeriodId, dto: ClaimSummaryDto) {
    super();
    this.projectId = projectId;
    this.partnerId = partnerId;
    this.periodId = periodId;
    this.dto = dto;
  }

  async accessControl(auth: Authorisation) {
    return auth.forPartner(this.projectId, this.partnerId).hasRole(ProjectRolePermissionBits.FinancialContact);
  }
  protected async getZodSchema() {
    return { schema: claimSummarySchema, errorMap: claimSummaryErrorMap };
  }

  protected async mapToZod() {
    return {
      id: this.dto.id,
      form: this.dto.form,
      button_submit: this.dto.button_submit,
      status: this.dto.status,
      comments: this.dto.comments,
      remainingOfferCosts: this.dto.remainingOfferCosts,
      project: this.dto.project,
      claim: this.dto.claim,
      documents: this.dto.documents,
    };
  }

  private getNextStatus(status: ClaimStatus, monitoringLevel: ProjectMonitoringLevel) {
    switch (status) {
      case ClaimStatus.DRAFT:
      case ClaimStatus.MO_QUERIED:
        if (monitoringLevel === ProjectMonitoringLevel.InternalAssurance) {
          return ClaimStatus.AWAITING_IUK_APPROVAL;
        } else {
          return ClaimStatus.SUBMITTED;
        }

      case ClaimStatus.AWAITING_IAR:
      case ClaimStatus.INNOVATE_QUERIED:
        return ClaimStatus.AWAITING_IUK_APPROVAL;
      default:
        return status;
    }
  }

  private readonly participantVisibleStatus: ClaimStatus[] = [
    ClaimStatus.DRAFT,
    ClaimStatus.MO_QUERIED,
    ClaimStatus.SUBMITTED,
    ClaimStatus.AWAITING_IAR,
  ];

  private getChangeStatusVisibility(existingStatus: ClaimStatus, nextStatus: ClaimStatus): boolean {
    const hasVisibleStatus = this.participantVisibleStatus.includes(nextStatus);

    if (hasVisibleStatus) return true;

    const currentlyQueried = existingStatus === ClaimStatus.INNOVATE_QUERIED;
    const updateStateIsAwaiting = nextStatus === ClaimStatus.AWAITING_IUK_APPROVAL;

    return currentlyQueried && updateStateIsAwaiting;
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<ClaimSummarySchemaType>,
  ): Promise<boolean> {
    if (validatedData.button_submit === "submit") {
      const nextStatus = this.getNextStatus(validatedData.status, validatedData.project.monitoringLevel);
      const hasChangedClaimStatus = validatedData.status !== nextStatus;
      if (hasChangedClaimStatus) {
        await Promise.all([
          context.repositories.claims.update({
            Id: validatedData.id,
            Acc_ClaimStatus__c: nextStatus,
            Acc_ReasonForDifference__c: "",
          }),

          context.repositories.claimStatusChanges.create({
            Acc_Claim__c: validatedData.id,
            Acc_ExternalComment__c: validatedData.comments,
            Acc_ParticipantVisibility__c: this.getChangeStatusVisibility(validatedData.status, nextStatus),
          }),
        ]);
      }
    } else {
      await context.repositories.claims.update({
        Id: validatedData.id,
        Acc_ReasonForDifference__c: validatedData.comments,
      });
    }
    return true;
  }
}
