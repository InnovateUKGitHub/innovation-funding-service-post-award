import { GetMonitoringReportActiveQuestions } from "../features/monitoringReports/getMonitoringReportActiveQuestions";
import { FormHandlerBase, IFormBody, IFormButton } from "./formHandlerBase";
import { ILinkInfo } from "../../types/ILinkInfo";
import { IContext } from "../../types/IContext";
import { MonitoringReportDto } from "../../types/dtos/monitoringReportDto";
import {
  MonitoringReportDashboardRoute,
  MonitoringReportPrepareParams,
  MonitoringReportPrepareRoute
} from "../../ui/containers";
import { SALESFORCE_DATE_FORMAT } from "../features/common";
import { MonitoringReportDtoValidator } from "../../ui/validators/MonitoringReportDtoValidator";
import { SaveMonitoringReport } from "../features/monitoringReports/saveMonitoringReport";
import { getMonitoringReportEditor } from "../../ui/redux/selectors";
import { MonitoringReportStatus } from "../../types/constants/monitoringReportStatus";
import { mapMonitoringReportStatus } from "@server/features/monitoringReports/mapMonitoringReportStatus";

export class MonitoringReportFormHandler extends FormHandlerBase<MonitoringReportPrepareParams, MonitoringReportDto> {

  constructor() {
    super(MonitoringReportPrepareRoute, ["save-draft", "save-submitted"]);
  }

  protected async getDto(context: IContext, params: MonitoringReportPrepareParams, button: IFormButton, body: IFormBody): Promise<MonitoringReportDto> {
    const header = await context.repositories.monitoringReportHeader.get(params.projectId, params.periodId);
    const questions = await context.runQuery(new GetMonitoringReportActiveQuestions());

    return {
      headerId: header.Id,
      title: header.Name,
      status: mapMonitoringReportStatus(header),
      statusName: header.MonitoringReportStatusName,
      projectId: header.Acc_Project__c,
      startDate: context.clock.parse(header.Acc_PeriodStartDate__c, SALESFORCE_DATE_FORMAT)!,
      endDate: context.clock.parse(header.Acc_PeriodEndDate__c, SALESFORCE_DATE_FORMAT)!,
      periodId: header.Acc_ProjectPeriodNumber__c,
      lastUpdated: null,
      questions: questions.map(q => ({
        displayOrder: q.displayOrder,
        title: q.title,
        responseId: body[`question_${q.displayOrder}_reponse_id`],
        optionId: body[`question_${q.displayOrder}_options`],
        comments: body[`question_${q.displayOrder}_comments`],
        options: q.options,
        isScored: q.isScored
      }))
    };
  }

  protected createValidationResult(params: MonitoringReportPrepareParams, dto: MonitoringReportDto) {
    return new MonitoringReportDtoValidator(dto, false, false, dto.questions, 100);
  }

  protected getStoreInfo(params: MonitoringReportPrepareParams): { key: string; store: string; } {
    return getMonitoringReportEditor(params.projectId, params.periodId);
  }

  protected async run(context: IContext, params: MonitoringReportPrepareParams, button: IFormButton, dto: MonitoringReportDto): Promise<ILinkInfo> {
    const command = new SaveMonitoringReport(dto, button.name === "save-submitted");
    await context.runCommand(command);

    return MonitoringReportDashboardRoute.getLink({ projectId: params.projectId });
  }
}
