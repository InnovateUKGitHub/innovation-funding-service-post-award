import { SaveMonitoringReport } from "../features/monitoringReports/saveMonitoringReport";
import { FormHandlerBase, IFormBody, IFormButton } from "./formHandlerBase";
import { IContext } from "@framework/types/IContext";
import { MonitoringReportDto } from "@framework/dtos/monitoringReportDto";
import {
  MonitoringReportDashboardRoute,
  MonitoringReportPrepareParams,
  MonitoringReportPrepareRoute
} from "../../ui/containers";
import { MonitoringReportDtoValidator } from "../../ui/validators/MonitoringReportDtoValidator";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { getMonitoringReportEditor } from "../../ui/redux/selectors";
import { GetMonitoringReportById } from "@server/features/monitoringReports/getMonitoringReport";

export class MonitoringReportPrepareFormHandler extends FormHandlerBase<MonitoringReportPrepareParams, MonitoringReportDto> {

  constructor() {
    super(MonitoringReportPrepareRoute, ["save-draft", "save-submitted"]);
  }

  protected async getDto(context: IContext, params: MonitoringReportPrepareParams, button: IFormButton, body: IFormBody): Promise<MonitoringReportDto> {
    const query = new GetMonitoringReportById(params.projectId, params.id!);
    const dto = await context.runQuery(query);
    dto.periodId = parseInt(body.period, 10);
    dto.questions.forEach(q => {
      q.optionId = body[`question_${q.displayOrder}_options`];
      q.comments = body[`question_${q.displayOrder}_comments`];
    });
    return dto;
  }

  protected createValidationResult(params: MonitoringReportPrepareParams, dto: MonitoringReportDto) {
    return new MonitoringReportDtoValidator(dto, false, false, dto.questions, 100);
  }

  protected getStoreInfo(params: MonitoringReportPrepareParams): { key: string; store: string; } {
    return getMonitoringReportEditor(params.projectId, params.id);
  }

  protected async run(context: IContext, params: MonitoringReportPrepareParams, button: IFormButton, dto: MonitoringReportDto): Promise<ILinkInfo> {
    const command = new SaveMonitoringReport(dto, button.name === "save-submitted");
    await context.runCommand(command);

    return MonitoringReportDashboardRoute.getLink({ projectId: params.projectId });
  }
}
