import { PCRDto } from "@framework/dtos/pcrDtos";
import { GetByIdQuery } from "@server/features/projects/getDetailsByIdQuery";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import {
  PcrPrepareSchema,
  pcrPrepareErrorMap,
  pcrPrepareSchema,
} from "@ui/pages/pcrs/overview/projectChangeRequestPrepare.zod";
import {
  ProjectChangeRequestPrepareParams,
  ProjectChangeRequestPrepareRoute,
} from "@ui/pages/pcrs/overview/projectChangeRequestPrepare.page";
import { ProjectChangeRequestSubmittedForReviewRoute } from "@ui/pages/pcrs/submitSuccess/ProjectChangeRequestSubmittedForReview.page";
import { PCRsDashboardRoute } from "@ui/pages/pcrs/dashboard/PCRDashboard.page";
import { PCRStatus } from "@framework/constants/pcrConstants";
import { ProjectMonitoringLevel } from "@framework/constants/project";
import { mapToPCRApiName } from "@server/repositories/projectChangeRequestRepository";

export class ProjectChangeRequestPrepareFormHandler extends ZodFormHandlerBase<
  PcrPrepareSchema,
  ProjectChangeRequestPrepareParams
> {
  monitoringLevel: ProjectMonitoringLevel = ProjectMonitoringLevel.Unknown;

  constructor() {
    super({
      routes: [ProjectChangeRequestPrepareRoute],
      forms: [FormTypes.PcrPrepare],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: pcrPrepareSchema,
      errorMap: pcrPrepareErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<PcrPrepareSchema>> {
    this.monitoringLevel = input.monitoringLevel;
    return {
      form: input.form,
      button_submit: input.button_submit,
      comments: input.comments,
      reasoningStatus: input.reasoningStatus,
      status: input.status,
      items: JSON.parse(input.items),
    };
  }

  protected async getDto(
    context: IContext,
    params: ProjectChangeRequestPrepareParams,
    buttonName: string,
    body: z.output<PcrPrepareSchema>,
  ): Promise<PCRDto> {
    const [pcr, project] = await Promise.all([
      context.runQuery(new GetPCRByIdQuery(params.projectId, params.pcrId)),
      context.runQuery(new GetByIdQuery(params.projectId)),
    ]);
    pcr.comments = body.comments ?? "";

    if (buttonName === "submit") {
      switch (pcr.status) {
        case PCRStatus.DraftWithProjectManager:
        case PCRStatus.QueriedByMonitoringOfficer:
          if (project.monitoringLevel === ProjectMonitoringLevel.InternalAssurance) {
            pcr.status = PCRStatus.SubmittedToInnovateUK;
          } else {
            pcr.status = PCRStatus.SubmittedToMonitoringOfficer;
          }
          break;
        case PCRStatus.QueriedToProjectManager:
          pcr.status = PCRStatus.SubmittedToInnovateUK;
          break;
      }
    }

    return pcr;
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
    pcrId: PcrId,
  ): Promise<void> {
    const nowSubmittedToMo = newStatus === PCRStatus.SubmittedToMonitoringOfficer;
    const nowQueriedToMo = newStatus === PCRStatus.QueriedByMonitoringOfficer;
    const nowQueriedToInnovateUk = newStatus === PCRStatus.SubmittedToInnovateUK;
    const previouslyQueriedByInnovateUk = originalStatus === PCRStatus.QueriedToProjectManager;
    const shouldPmSee = nowSubmittedToMo || nowQueriedToMo || (nowQueriedToInnovateUk && previouslyQueriedByInnovateUk);

    await context.repositories.projectChangeRequestStatusChange.createStatusChange({
      Acc_ProjectChangeRequest__c: pcrId,
      Acc_ExternalComment__c: comments,
      Acc_ParticipantVisibility__c: shouldPmSee,
    });
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<PcrPrepareSchema>;
    context: IContext;
    params: ProjectChangeRequestPrepareParams;
  }): Promise<string> {
    if (input.button_submit === "submit") {
      const newStatus = this.getNewStatus(input.status, this.monitoringLevel);
      await Promise.all([
        context.repositories.projectChangeRequests.updateSingleSalesforceItem({
          Id: params.pcrId,
          Acc_Status__c: mapToPCRApiName(newStatus),
          Acc_Comments__c: "",
        }),
        this.insertStatusChange(context, input.comments ?? "", input.status, newStatus, params.pcrId),
      ]);
    } else {
      await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
        Id: params.pcrId,
        Acc_Comments__c: input.comments,
      });
    }

    if (input.button_submit === "submit") {
      return ProjectChangeRequestSubmittedForReviewRoute.getLink({ projectId: params.projectId, pcrId: params.pcrId })
        .path;
    } else {
      return PCRsDashboardRoute.getLink({ projectId: params.projectId }).path;
    }
  }
}
