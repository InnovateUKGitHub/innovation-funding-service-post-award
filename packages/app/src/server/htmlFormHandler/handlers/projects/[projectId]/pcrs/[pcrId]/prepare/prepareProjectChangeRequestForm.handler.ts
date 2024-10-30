import { PCRDto } from "@framework/dtos/pcrDtos";
import { GetByIdQuery } from "@server/features/projects/getDetailsByIdQuery";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { IContext } from "@framework/types/IContext";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
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

export class ProjectChangeRequestPrepareFormHandler extends ZodFormHandlerBase<
  PcrPrepareSchema,
  ProjectChangeRequestPrepareParams
> {
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
    return {
      form: input.form,
      button_submit: input.button_submit,
      comments: input.comments,
      reasoningStatus: input.reasoningStatus,
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

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<PcrPrepareSchema>;
    context: IContext;
    params: ProjectChangeRequestPrepareParams;
  }): Promise<string> {
    const pcr = await this.getDto(context, params, input.button_submit, input);
    await context.runCommand(
      new UpdatePCRCommand({
        projectId: params.projectId,
        projectChangeRequestId: params.pcrId,
        pcr,
      }),
    );

    if (input.button_submit === "submit") {
      return ProjectChangeRequestSubmittedForReviewRoute.getLink({ projectId: params.projectId, pcrId: params.pcrId })
        .path;
    } else {
      return PCRsDashboardRoute.getLink({ projectId: params.projectId }).path;
    }
  }
}
