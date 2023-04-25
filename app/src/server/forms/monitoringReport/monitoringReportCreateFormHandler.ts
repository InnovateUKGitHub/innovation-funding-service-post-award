import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import { CreateMonitoringReportCommand, GetMonitoringReportActiveQuestions } from "@server/features/monitoringReports";
import {
  MonitoringReportCreateRoute,
  MonitoringReportDashboardRoute,
  MonitoringReportWorkflowRoute,
} from "@ui/containers/monitoringReports";
import { MonitoringReportDtoValidator } from "@ui/validators/MonitoringReportDtoValidator";
import { MonitoringReportStatus } from "@framework/constants";
import { MonitoringReportDto } from "@framework/dtos";
import { IContext, ILinkInfo } from "@framework/types";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { MonitoringReportCreateParams } from "@ui/containers/monitoringReports/create/monitoringReportCreateDef";

export class MonitoringReportCreateFormHandler extends StandardFormHandlerBase<
  MonitoringReportCreateParams,
  "monitoringReport"
> {
  constructor() {
    super(MonitoringReportCreateRoute, ["save-continue", "save-return"], "monitoringReport");
  }

  protected async getDto(
    context: IContext,
    params: MonitoringReportCreateParams,
    button: IFormButton,
    body: IFormBody,
  ): Promise<MonitoringReportDto> {
    const questions = await context.runQuery(new GetMonitoringReportActiveQuestions());

    return {
      headerId: "" as MonitoringReportId,
      projectId: params.projectId,
      periodId: parseInt(body.period, 10),
      questions,
      status: MonitoringReportStatus.Draft,
      statusName: "",
      lastUpdated: null,
      startDate: null,
      endDate: null,
      addComments: "", // TODO:ACC-6858
    };
  }

  protected createValidationResult(params: MonitoringReportCreateParams, dto: MonitoringReportDto) {
    return new MonitoringReportDtoValidator(dto, false, false, dto.questions, 100);
  }

  protected getStoreKey(params: MonitoringReportCreateParams) {
    return storeKeys.getMonitoringReportKey(params.projectId);
  }

  protected async run(
    context: IContext,
    params: MonitoringReportCreateParams,
    button: IFormButton,
    dto: MonitoringReportDto,
  ): Promise<ILinkInfo> {
    const command = new CreateMonitoringReportCommand(dto, false);
    const id = (await context.runCommand(command)) as MonitoringReportId;

    if (button.name === "save-return") {
      return MonitoringReportDashboardRoute.getLink({ projectId: params.projectId, periodId: undefined });
    }
    return MonitoringReportWorkflowRoute.getLink({ projectId: params.projectId, id, mode: "prepare", step: 1 });
  }
}
