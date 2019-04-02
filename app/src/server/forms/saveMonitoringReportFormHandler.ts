import { FormHandlerBase, IFormBody, IFormButton } from "./formHandlerBase";
import {
  AllClaimsDashboardRoute,
  PrepareMonitoringReportParams,
  PrepareMonitoringReportRoute
} from "../../ui/containers";
import { ILinkInfo } from "../../types/ILinkInfo";
import { IContext } from "../../types/IContext";
import { MonitoringReportDto, QuestionDto } from "../../types/dtos/monitoringReportDto";
import { GetMonitoringReportQuestions } from "../features/monitoringReports/getMonitoringReportQuestions";
import { SALESFORCE_DATE_FORMAT } from "../features/common";
import { MonitoringReportDtoValidator } from "../../ui/validators/MonitoringReportDtoValidator";
import { SaveMonitoringReport } from "../features/monitoringReports/saveMonitoringReport";

interface Dto {
  monitoringReport: MonitoringReportDto;
  questions: QuestionDto[];
  submit: boolean;
}
export class MonitoringReportFormHandler extends FormHandlerBase<PrepareMonitoringReportParams, Dto> {

  constructor() {
    super(PrepareMonitoringReportRoute, ["save_and_return", "save_and_submit"]);
  }

  protected async getDto(context: IContext, params: PrepareMonitoringReportParams, button: IFormButton, body: IFormBody) {
    const header = await context.repositories.monitoringReportHeader.get(params.projectId, params.periodId);
    const questions = await context.runQuery(new GetMonitoringReportQuestions());

    const monitoringReport = {
      headerId: header.Id,
      title: body.title,
      status: header.Acc_MonitoringReportStatus__c,
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

    return {
      monitoringReport,
      questions,
      submit: button.name === "save_and_submit"
    };
  }

  protected createValidationResult(params: PrepareMonitoringReportParams, dto: Dto) {
    return new MonitoringReportDtoValidator(dto.monitoringReport, false, dto.submit, dto.questions, dto.monitoringReport.status);
  }

  protected getStoreInfo(params: PrepareMonitoringReportParams): { key: string; store: string; } {
    // TODO use selector once available
    return {
      store: "monitoringReport",
      key: `${params.projectId}_${params.periodId}`
    };
  }

  protected async run(context: IContext, params: PrepareMonitoringReportParams, button: IFormButton, dto: Dto): Promise<ILinkInfo> {
    const command = new SaveMonitoringReport( dto.monitoringReport, dto.submit);
    await context.runCommand(command);
    return AllClaimsDashboardRoute.getLink({ projectId: params.projectId});
  }
}
