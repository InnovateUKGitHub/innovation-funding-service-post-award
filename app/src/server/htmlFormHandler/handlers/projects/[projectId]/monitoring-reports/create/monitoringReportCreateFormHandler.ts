import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/htmlFormHandler/formHandlerBase";
import { MonitoringReportDtoValidator } from "@ui/validation/validators/MonitoringReportDtoValidator";
import { storeKeys } from "@server/features/common/storeKeys";
import { MonitoringReportStatus } from "@framework/constants/monitoringReportStatus";
import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { MonitoringReportDto } from "@framework/dtos/monitoringReportDto";
import { CreateMonitoringReportCommand } from "@server/features/monitoringReports/createMonitoringReport";
import { GetMonitoringReportActiveQuestions } from "@server/features/monitoringReports/getMonitoringReportActiveQuestions";
import {
  MonitoringReportCreateParams,
  MonitoringReportCreateRoute,
} from "@ui/containers/pages/monitoringReports/create/monitoringReportCreate.page";
import { MonitoringReportDashboardRoute } from "@ui/containers/pages/monitoringReports/monitoringReportDashboard/monitoringReportDashboard.page";
import { MonitoringReportWorkflowRoute } from "@ui/containers/pages/monitoringReports/workflow/monitoringReportWorkflow.page";

export class MonitoringReportCreateFormHandler extends StandardFormHandlerBase<
  MonitoringReportCreateParams,
  MonitoringReportDto
> {
  constructor() {
    super(MonitoringReportCreateRoute, ["submit"]);
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
      periodId: parseInt(body.period, 10) as PeriodId,
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

    if (button.value === "save-return") {
      return MonitoringReportDashboardRoute.getLink({ projectId: params.projectId, periodId: undefined });
    }
    return MonitoringReportWorkflowRoute.getLink({ projectId: params.projectId, id, mode: "prepare", step: 1 });
  }
}
