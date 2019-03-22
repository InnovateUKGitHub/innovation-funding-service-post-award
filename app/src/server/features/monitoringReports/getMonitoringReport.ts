import { QueryBase } from "../common";
import { Authorisation, IContext, ProjectRole } from "../../../types";

export class GetMonitoringReport extends QueryBase<MonitoringReportDto> {
  constructor(
    private readonly monitoringReportHeaderId: string, // TODO don't use this
    private readonly projectId: string,
    private readonly periodId: number,
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return auth.for(this.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  protected async Run(context: IContext) {
    const header = await context.repositories.monitoringReportHeader.get(this.projectId, this.periodId);
    const results = await context.repositories.monitoringReportResponse.getAllForHeader(this.monitoringReportHeaderId);
    // TODO rename getAll to getAllEnabled ?
    const questions = await context.repositories.questions.getAll(); // TODO rename questions repo to monitoringReportQuestions ?;

    const questionsDtos = [{ // TODO
        title: "",
        score: 1,
        comments: "",
        options: [],
    }];

    // TODO
    return {
      status: "",
      startDate: new Date(),
      endDate: new Date(),
      periodId: 1,
      questions: questionsDtos,
    };
  }
}
