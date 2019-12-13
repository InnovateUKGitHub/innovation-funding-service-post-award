import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";
import { CreateMonitoringReportCommand, GetMonitoringReportActiveQuestions } from "@server/features/monitoringReports";
import {
  MonitoringReportCreateParams,
  MonitoringReportCreateRoute,
  MonitoringReportDashboardRoute,
  MonitoringReportPrepareRoute,
} from "@ui/containers/monitoringReports";
import { MonitoringReportDtoValidator } from "@ui/validators/MonitoringReportDtoValidator";
import { MonitoringReportStatus } from "@framework/constants";
import { MonitoringReportDto } from "@framework/dtos";
import { IContext, ILinkInfo } from "@framework/types";
import { storeKeys } from "@ui/redux/stores/storeKeys";

export class MonitoringReportCreateFormHandler extends StandardFormHandlerBase<MonitoringReportCreateParams, "monitoringReport"> {
  constructor() {
    super(MonitoringReportCreateRoute, [ "save-continue", "save-return"], "monitoringReport");
  }

  protected async getDto(context: IContext, params: MonitoringReportCreateParams, button: IFormButton, body: IFormBody): Promise<MonitoringReportDto> {
    const questions = await context.runQuery(new GetMonitoringReportActiveQuestions());

    return {
      headerId: "",
      projectId: params.projectId,
      periodId: parseInt(body.period, 10),
      questions,
      status: MonitoringReportStatus.Draft,
      statusName: "",
      lastUpdated: null,
      startDate: null,
      endDate: null,
    };
  }

  protected createValidationResult(params: MonitoringReportCreateParams, dto: MonitoringReportDto) {
    return new MonitoringReportDtoValidator(dto, false, false, dto.questions, 100);
  }

  protected getStoreKey(params: MonitoringReportCreateParams) {
    return storeKeys.getMonitoringReportKey(params.projectId);
  }

  protected async run(context: IContext, params: MonitoringReportCreateParams, button: IFormButton, dto: MonitoringReportDto): Promise<ILinkInfo> {
    const command = new CreateMonitoringReportCommand(dto, false);
    const id = await context.runCommand(command);

    if (button.name === "save-return") {
      return MonitoringReportDashboardRoute.getLink({ projectId: params.projectId });
    }
    return MonitoringReportPrepareRoute.getLink({ projectId: params.projectId, id });

  }
}
