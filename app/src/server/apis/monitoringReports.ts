import {
  MonitoringReportDto,
  MonitoringReportQuestionDto,
  MonitoringReportStatusChangeDto,
  MonitoringReportSummaryDto,
} from "@framework/dtos/monitoringReportDto";
import { contextProvider } from "@server/features/common/contextProvider";
import { CreateMonitoringReportCommand } from "@server/features/monitoringReports/createMonitoringReport";
import { DeleteMonitoringReportCommand } from "@server/features/monitoringReports/deleteMonitoringReport";
import { GetMonitoringReportActiveQuestions } from "@server/features/monitoringReports/getMonitoringReportActiveQuestions";
import { GetMonitoringReportStatusChanges } from "@server/features/monitoringReports/getMonitoringReportStatusChanges";
import { processDto } from "../../shared/processResponse";
import { GetMonitoringReportById } from "../features/monitoringReports/getMonitoringReport";
import { GetMonitoringReportsForProject } from "../features/monitoringReports/getMonitoringReportsForProject";
import { SaveMonitoringReport } from "../features/monitoringReports/saveMonitoringReport";
import { ApiParams, ControllerBaseWithSummary } from "./controllerBase";

export interface IMonitoringReportsApi {
  createMonitoringReport: (
    params: ApiParams<{ monitoringReportDto: MonitoringReportDto; submit: boolean }>,
  ) => Promise<MonitoringReportDto>;
  get: (params: ApiParams<{ projectId: ProjectId; reportId: MonitoringReportId }>) => Promise<MonitoringReportDto>;
  getAllForProject: (params: ApiParams<{ projectId: ProjectId }>) => Promise<MonitoringReportSummaryDto[]>;
  saveMonitoringReport: (
    params: ApiParams<{ monitoringReportDto: MonitoringReportDto; submit: boolean }>,
  ) => Promise<MonitoringReportDto>;
  deleteMonitoringReport: (
    params: ApiParams<{ projectId: ProjectId; reportId: MonitoringReportId }>,
  ) => Promise<boolean>;
  getActiveQuestions: (params: ApiParams) => Promise<MonitoringReportQuestionDto[]>;
  getStatusChanges: (
    params: ApiParams<{ projectId: ProjectId; reportId: MonitoringReportId }>,
  ) => Promise<MonitoringReportStatusChangeDto[]>;
}

class Controller
  extends ControllerBaseWithSummary<MonitoringReportSummaryDto, MonitoringReportDto>
  implements IMonitoringReportsApi
{
  constructor() {
    super("monitoring-reports");

    this.postItem(
      "/",
      (p, q, b) => ({ monitoringReportDto: processDto(b), submit: q.submit === "true" }),
      p => this.createMonitoringReport(p),
    );
    this.getItem(
      "/:projectId/:reportId",
      p => ({ projectId: p.projectId, reportId: p.reportId }),
      p => this.get(p),
    );
    this.getItems(
      "/",
      (p, q) => ({ projectId: q.projectId }),
      p => this.getAllForProject(p),
    );
    this.putItem(
      "/",
      (p, q, b: MonitoringReportDto) => ({ monitoringReportDto: processDto(b), submit: q.submit === "true" }),
      p => this.saveMonitoringReport(p),
    );
    this.deleteItem(
      "/:projectId/:reportId",
      p => ({ projectId: p.projectId, reportId: p.reportId }),
      p => this.deleteMonitoringReport(p),
    );
    this.getCustom(
      "/status-changes/:projectId/:reportId",
      p => ({ projectId: p.projectId, reportId: p.reportId }),
      p => this.getStatusChanges(p),
    );
    this.getCustom(
      "/questions",
      () => ({}),
      p => this.getActiveQuestions(p),
    );
  }

  public async get(params: ApiParams<{ projectId: ProjectId; reportId: MonitoringReportId }>) {
    const { projectId, reportId } = params;
    const query = new GetMonitoringReportById(projectId, reportId);
    return contextProvider.start(params).runQuery(query);
  }

  public async saveMonitoringReport(params: ApiParams<{ monitoringReportDto: MonitoringReportDto; submit: boolean }>) {
    const { monitoringReportDto, submit } = params;
    const context = contextProvider.start(params);

    await context.runCommand(new SaveMonitoringReport(monitoringReportDto, submit));
    return context.runQuery(new GetMonitoringReportById(monitoringReportDto.projectId, monitoringReportDto.headerId));
  }

  public async createMonitoringReport(
    params: ApiParams<{ monitoringReportDto: MonitoringReportDto; submit: boolean }>,
  ) {
    const { monitoringReportDto, submit } = params;
    const context = contextProvider.start(params);

    const id = (await context.runCommand(
      new CreateMonitoringReportCommand(monitoringReportDto, submit),
    )) as MonitoringReportId;
    return context.runQuery(new GetMonitoringReportById(monitoringReportDto.projectId, id));
  }

  public async getAllForProject(params: ApiParams<{ projectId: ProjectId }>) {
    const { projectId } = params;
    const query = new GetMonitoringReportsForProject(projectId);
    return contextProvider.start(params).runQuery(query);
  }

  public getActiveQuestions(params: ApiParams) {
    return contextProvider.start(params).runQuery(new GetMonitoringReportActiveQuestions());
  }

  public getStatusChanges(params: ApiParams<{ projectId: ProjectId; reportId: MonitoringReportId }>) {
    const { projectId, reportId } = params;
    const query = new GetMonitoringReportStatusChanges(projectId, reportId);
    return contextProvider.start(params).runQuery(query);
  }

  public async deleteMonitoringReport(params: ApiParams<{ projectId: ProjectId; reportId: MonitoringReportId }>) {
    const { projectId, reportId } = params;
    const command = new DeleteMonitoringReportCommand(projectId, reportId);
    await contextProvider.start(params).runCommand(command);

    return true;
  }
}

export const controller = new Controller();
