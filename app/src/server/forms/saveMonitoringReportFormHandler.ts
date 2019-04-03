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

export class MonitoringReportFormHandler extends FormHandlerBase<MonitoringReportPrepareParams, MonitoringReportDto> {

  constructor() {
    super(MonitoringReportPrepareRoute, ["save-draft", "save-submitted"]);
  }

  protected async getDto(context: IContext, params: MonitoringReportPrepareParams, button: IFormButton, body: IFormBody): Promise<MonitoringReportDto> {
    const header = await context.repositories.monitoringReportHeader.get(params.projectId, params.periodId);
    const questions = await context.runQuery(new GetMonitoringReportActiveQuestions());

    return {
      headerId: header.Id,
      status: header.Acc_MonitoringReportStatus__c === "Draft" ? MonitoringReportStatus.DRAFT : MonitoringReportStatus.SUBMITTED,
      projectId: header.Acc_ProjectId__c,
      startDate: context.clock.parse(header.Acc_ProjectStartDate__c, SALESFORCE_DATE_FORMAT)!,
      endDate: context.clock.parse(header.Acc_ProjectEndDate__c, SALESFORCE_DATE_FORMAT)!,
      periodId: header.Acc_ProjectPeriodNumber__c,
      questions: questions.map(q => ({
        displayOrder: q.displayOrder,
        title: q.title,
        responseId: body[`question_${q.displayOrder}_reponse_id`],
        optionId: body[`question_${q.displayOrder}_options`],
        comments: body[`question_${q.displayOrder}_comments`],
        options: q.options
      }))
    };
  }

  protected createValidationResult(params: MonitoringReportPrepareParams, dto: MonitoringReportDto) {
    return new MonitoringReportDtoValidator(dto, false, false, dto.questions);
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
