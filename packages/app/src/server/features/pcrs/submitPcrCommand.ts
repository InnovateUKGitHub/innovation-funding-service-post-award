import { ProjectMonitoringLevel, ProjectRolePermissionBits } from "@framework/constants/project";
import { PcrSubmitDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { mapToPCRApiName } from "@server/repositories/projectChangeRequestRepository";
import {
  pcrPrepareErrorMap,
  pcrPrepareSchema,
  PcrPrepareSchema,
} from "@ui/pages/pcrs/overview/projectChangeRequestPrepare.zod";
import { PCRStatus } from "@framework/constants/pcrConstants";

export class SubmitPcrCommand extends ZodAuthorisedAsyncCommandBase<boolean, PcrPrepareSchema, PcrSubmitDto> {
  public readonly runnableName: string = "SubmitPcrCommand";
  protected readonly projectId: ProjectId;
  private readonly pcrId: PcrId;
  private readonly form: FormTypes.PcrPrepare;
  protected readonly dto: PcrSubmitDto;
  protected readonly monitoringLevel: PcrSubmitDto["monitoringLevel"];

  constructor({
    projectId,
    pcrId,
    pcr,
    form,
  }: {
    projectId: ProjectId;
    pcrId: PcrId;
    pcr: PcrSubmitDto;
    form: FormTypes.PcrPrepare;
  }) {
    super();
    this.projectId = projectId;
    this.pcrId = pcrId;
    this.dto = pcr;
    this.form = form;
    this.monitoringLevel = pcr.monitoringLevel;
  }

  async accessControl(auth: Authorisation) {
    return auth
      .forProject(this.projectId)
      .hasAnyRoles(ProjectRolePermissionBits.ProjectManager, ProjectRolePermissionBits.MonitoringOfficer);
  }

  protected async getZodSchema() {
    return { schema: pcrPrepareSchema, errorMap: pcrPrepareErrorMap };
  }

  protected async mapToZod() {
    return {
      form: this.form,
      button_submit: this.dto.button_submit,
      items: this.dto.items,
      reasoningStatus: this.dto.reasoningStatus,
      status: this.dto.status,
      comments: this.dto.comments,
    };
  }

  private getNewStatus(status: PCRStatus, monitoringLevel: ProjectMonitoringLevel): PCRStatus {
    switch (status) {
      case PCRStatus.DraftWithProjectManager:
      case PCRStatus.QueriedByMonitoringOfficer:
        if (monitoringLevel === ProjectMonitoringLevel.InternalAssurance) {
          return PCRStatus.SubmittedToInnovateUK;
        } else {
          return PCRStatus.SubmittedToMonitoringOfficer;
        }
      case PCRStatus.QueriedToProjectManager:
        return PCRStatus.SubmittedToInnovateUK;
      default:
        return status;
    }
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

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<PcrPrepareSchema>,
  ): Promise<boolean> {
    if (validatedData.button_submit === "submit") {
      const newStatus = this.getNewStatus(validatedData.status, this.monitoringLevel);
      await Promise.allSettled([
        context.repositories.projectChangeRequests.updateSingleSalesforceItem({
          Id: this.pcrId,
          Acc_Status__c: mapToPCRApiName(newStatus),
          Acc_Comments__c: validatedData.comments,
        }),
        this.insertStatusChange(context, validatedData.comments ?? "", validatedData.status, newStatus),
      ]);
    }
    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: this.pcrId,
      Acc_Comments__c: validatedData.comments,
    });

    return true;
  }
}
