import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { PCRReviewParams, PCRReviewRoute } from "@ui/pages/pcrs/pcrReview";
import { pcrReviewErrorMap, PcrReviewSchema, pcrReviewSchema } from "@ui/pages/pcrs/pcrReview.zod";
import { PCRsDashboardRoute } from "@ui/pages/pcrs/dashboard/PCRDashboard.page";
import { PCRStatus } from "@framework/constants/pcrConstants";
import { mapToPCRApiName } from "@server/repositories/projectChangeRequestRepository";

export class ProjectChangeRequestReviewFormHandler extends ZodFormHandlerBase<PcrReviewSchema, PCRReviewParams> {
  constructor() {
    super({
      routes: [PCRReviewRoute],
      forms: [FormTypes.PcrReview],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: pcrReviewSchema,
      errorMap: pcrReviewErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<PcrReviewSchema>> {
    return {
      form: input.form,
      status: input.status,
      comments: input.comments,
      previousStatus: parseInt(input.previousStatus, 10),
    };
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
    input: z.output<PcrReviewSchema>;
    context: IContext;
    params: PCRReviewParams;
  }): Promise<string> {
    const status = parseInt(input.status, 10);

    await Promise.all([
      context.repositories.projectChangeRequests.updateSingleSalesforceItem({
        Id: params.pcrId,
        Acc_Status__c: mapToPCRApiName(status),
        Acc_Comments__c: "",
      }),
      this.insertStatusChange(context, input.comments ?? "", input.previousStatus, status, params.pcrId),
    ]);

    return PCRsDashboardRoute.getLink({ projectId: params.projectId }).path;
  }
}
