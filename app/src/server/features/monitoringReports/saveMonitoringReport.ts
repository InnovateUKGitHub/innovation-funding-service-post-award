import { BadRequestError, CommandBase, ValidationError } from "../common";
import { Authorisation, IContext, ProjectRole } from "../../../types";
import { MonitoringReportDtoValidator } from "../../../ui/validators/MonitoringReportDtoValidator";
import { GetMonitoringReportActiveQuestions } from "./getMonitoringReportActiveQuestions";
import { MonitoringReportDto } from "../../../types/dtos/monitoringReportDto";
import { MonitoringReportStatus } from "../../../types/constants/monitoringReportStatus";
import { ISalesforceMonitoringReportResponse } from "../../repositories";
import { Updatable } from "../../repositories/salesforceRepositoryBase";

export class SaveMonitoringReport extends CommandBase<boolean> {
  constructor(
    private readonly monitoringReportDto: MonitoringReportDto,
    private readonly submit: boolean
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return context.config.features.monitoringReports && auth.forProject(this.monitoringReportDto.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  private async updateHeader(context: IContext) {
    if (!this.submit) return Promise.resolve(true);
    return context.repositories.monitoringReportHeader.update({
      Id: this.monitoringReportDto.headerId,
      Acc_MonitoringReportStatus__c: MonitoringReportStatus.SUBMITTED,
    });
  }

  protected async Run(context: IContext) {
    const header = await context.repositories.monitoringReportHeader.get(this.monitoringReportDto.projectId, this.monitoringReportDto.periodId);

    if (header.Id !== this.monitoringReportDto.headerId) {
      throw new BadRequestError("Header does not match monitoringReportDto");
    }

    if(header.Acc_MonitoringReportStatus__c !== MonitoringReportStatus.DRAFT) {
      throw new BadRequestError("Report has already been submitted");
    }

    const questions = await context.runQuery(new GetMonitoringReportActiveQuestions());

    const validationResult = new MonitoringReportDtoValidator(this.monitoringReportDto, true, this.submit, questions);
    if (!validationResult.isValid) {
      throw new ValidationError(validationResult);
    }

    const existing = (await context.repositories.monitoringReportResponse.getAllForHeader(this.monitoringReportDto.headerId)) || [];
    const updateDtos = this.monitoringReportDto.questions.filter(x => x.responseId && x.optionId);
    const insertDtos = this.monitoringReportDto.questions.filter(x => !x.responseId && x.optionId);
    const persistedIds = updateDtos.map(x => x.responseId);
    const deleteItems = existing.filter(x => persistedIds.indexOf(x.Id) === -1).map(x => x.Id);

    const updateItems = updateDtos.map<Updatable<ISalesforceMonitoringReportResponse>>(updateDto => ({
      Id: updateDto.responseId!,
      Acc_Question__c: updateDto.optionId!,
      Acc_QuestionComments__c: updateDto.comments
    }));

    const insertItems = insertDtos.map(insertDto => ({
      Acc_MonitoringReportHeader__c: this.monitoringReportDto.headerId,
      Acc_Question__c: insertDto.optionId!,
      Acc_QuestionComments__c: insertDto.comments
    }));

    await Promise.all<{}>([
      context.repositories.monitoringReportResponse.update(updateItems),
      context.repositories.monitoringReportResponse.insert(insertItems),
      context.repositories.monitoringReportResponse.delete(deleteItems),
    ]);

    return this.updateHeader(context);
  }
}
