import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PcrReviewDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";

import { pcrReviewErrorMap, pcrReviewSchema, PcrReviewSchema } from "@ui/pages/pcrs/pcrReview.zod";
import { PCRStatus } from "@framework/constants/pcrConstants";
import { mapToPCRApiName } from "@server/repositories/projectChangeRequestRepository";

export class UpdatePcrReviewCommand extends ZodAuthorisedAsyncCommandBase<boolean, PcrReviewSchema, PcrReviewDto> {
  public readonly runnableName: string = "UpdatePcrReviewCommand";
  protected readonly projectId: ProjectId;
  private readonly pcrId: PcrId;
  protected readonly dto: PcrReviewDto;

  constructor({ projectId, pcrId, pcr }: { projectId: ProjectId; pcrId: PcrId; pcr: PcrReviewDto }) {
    super();
    this.projectId = projectId;
    this.pcrId = pcrId;
    this.dto = pcr;
  }

  async accessControl(auth: Authorisation) {
    return auth
      .forProject(this.projectId)
      .hasAnyRoles(ProjectRolePermissionBits.ProjectManager, ProjectRolePermissionBits.MonitoringOfficer);
  }

  protected async getZodSchema() {
    return { schema: pcrReviewSchema, errorMap: pcrReviewErrorMap };
  }

  protected async mapToZod() {
    return {
      form: this.dto.form,
      comments: this.dto.comments,
      status: this.dto.status,
      previousStatus: this.dto.previousStatus,
    };
  }

  private async insertStatusChange(
    context: IContext,
    comments: string,
    originalStatus: PCRStatus,
    newStatus: PCRStatus,
  ): Promise<void> {
    const nowSubmittedToMo = newStatus === PCRStatus.SubmittedToMonitoringOfficer;
    const nowQueriedToMo = newStatus === PCRStatus.QueriedByMonitoringOfficer;
    const nowQueriedToInnovateUk = newStatus === PCRStatus.SubmittedToInnovateUK;
    const previouslyQueriedByInnovateUk = originalStatus === PCRStatus.QueriedToProjectManager;
    const shouldPmSee = nowSubmittedToMo || nowQueriedToMo || (nowQueriedToInnovateUk && previouslyQueriedByInnovateUk);

    await context.repositories.projectChangeRequestStatusChange.createStatusChange({
      Acc_ProjectChangeRequest__c: this.pcrId,
      Acc_ExternalComment__c: comments,
      Acc_ParticipantVisibility__c: shouldPmSee,
    });
  }

  protected async runRepositoryCommands(context: IContext, validatedData: z.output<PcrReviewSchema>): Promise<boolean> {
    const status = parseInt(validatedData.status, 10);

    await Promise.all([
      context.repositories.projectChangeRequests.updateSingleSalesforceItem({
        Id: this.pcrId,
        Acc_Status__c: mapToPCRApiName(status),
        Acc_Comments__c: "",
      }),
      this.insertStatusChange(context, validatedData.comments ?? "", validatedData.previousStatus, status),
    ]);

    return true;
  }
}
