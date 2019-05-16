import { ApiParams, ControllerBaseWithSummary } from "./controllerBase";
import contextProvider from "../features/common/contextProvider";
import { GetMonitoringReportById } from "../features/monitoringReports/getMonitoringReport";
import { SaveMonitoringReport } from "../features/monitoringReports/saveMonitoringReport";
import { processDto } from "../../shared/processResponse";
import { GetMonitoringReportsForProject } from "../features/monitoringReports/getMonitoringReportsForProject";
import {
  MonitoringReportDto,
  MonitoringReportQuestionDto,
  MonitoringReportStatusChangeDto,
  MonitoringReportSummaryDto
} from "@framework/types";
import { CreateMonitoringReport } from "@server/features/monitoringReports/createMonitoringReport";
import { GetMonitoringReportActiveQuestions } from "@server/features/monitoringReports/getMonitoringReportActiveQuestions";
import { GetMonitoringReportStatusChanges } from "@server/features/monitoringReports/getMonitoringReportStatusChanges";
import { DeleteMonitoringReportCommand } from "@server/features/monitoringReports/deleteMonitoringReport";

export interface IMonitoringReportsApi {
  createMonitoringReport: (params: ApiParams<{ monitoringReportDto: MonitoringReportDto, submit: boolean }>) => Promise<MonitoringReportDto>;
  get: (params: ApiParams<{ projectId: string, reportId: string }>) => Promise<MonitoringReportDto>;
  getAllForProject: (params: ApiParams<{ projectId: string }>) => Promise<MonitoringReportSummaryDto[]>;
  saveMonitoringReport: (params: ApiParams<{ monitoringReportDto: MonitoringReportDto, submit: boolean }>) => Promise<MonitoringReportDto>;
  deleteMonitoringReport: (params: ApiParams<{ projectId: string, reportId: string }>) => Promise<boolean>;
  getActiveQuestions: (params: ApiParams<{}>) => Promise<MonitoringReportQuestionDto[]>;
  getStatusChanges: (params: ApiParams<{ projectId: string, reportId: string }>) => Promise<MonitoringReportStatusChangeDto[]>;
}

class Controller extends ControllerBaseWithSummary<MonitoringReportSummaryDto, MonitoringReportDto> implements IMonitoringReportsApi {

  constructor() {
    super("monitoring-reports");

    this.postItem("/", (p, q, b) => ({ monitoringReportDto: processDto(b), submit: q.submit === "true" }), (p) => this.createMonitoringReport(p));
    this.getItem("/:projectId/:reportId", (p) => ({ projectId: p.projectId, reportId: p.reportId }), (p) => this.get(p));
    this.getItems("/", (p, q) => ({ projectId: q.projectId }), (p) => this.getAllForProject(p));
    this.putItem("/", (p, q, b) => ({ monitoringReportDto: processDto(b), submit: q.submit === "true" }), (p) => this.saveMonitoringReport(p));
    this.deleteItem("/:projectId/:reportId", (p) => ({ projectId: p.projectId, reportId: p.reportId }), p => this.deleteMonitoringReport(p));
    this.getCustom("/status-changes/:projectId/:reportId", (p) => ({ projectId: p.projectId, reportId: p.reportId}), p => this.getStatusChanges(p));
    this.getCustom("/questions", (p) => ({}), p => this.getActiveQuestions(p));
  }

  public async get(params: ApiParams<{ projectId: string, reportId: string }>) {
    const { projectId, reportId } = params;
    const query = new GetMonitoringReportById(projectId, reportId);
    return contextProvider.start(params).runQuery(query);
  }

  public async saveMonitoringReport(params: ApiParams<{ monitoringReportDto: MonitoringReportDto, submit: boolean }>) {
    const { monitoringReportDto, submit } = params;
    const context = contextProvider.start(params);

    await context.runCommand(new SaveMonitoringReport(monitoringReportDto, submit));
    return context.runQuery(new GetMonitoringReportById(monitoringReportDto.projectId, monitoringReportDto.headerId));
  }

  public async createMonitoringReport(params: ApiParams<{ monitoringReportDto: MonitoringReportDto, submit: boolean }>) {
    const { monitoringReportDto, submit } = params;
    const context = contextProvider.start(params);

    const id = await context.runCommand(new CreateMonitoringReport(monitoringReportDto, submit));
    return context.runQuery(new GetMonitoringReportById(monitoringReportDto.projectId, id));
  }

  public async getAllForProject(params: ApiParams<{ projectId: string }>) {
    const { projectId } = params;
    const query = new GetMonitoringReportsForProject(projectId);
    return contextProvider.start(params).runQuery(query);
  }

  public getActiveQuestions(params: ApiParams<{}>) {
    return contextProvider.start(params).runQuery(new GetMonitoringReportActiveQuestions());
  }

  public getStatusChanges(params: ApiParams<{ projectId: string, reportId: string }>) {
    const { projectId, reportId } = params;
    const query = new GetMonitoringReportStatusChanges(projectId, reportId);
    return contextProvider.start(params).runQuery(query);
  }

  public async deleteMonitoringReport(params: ApiParams<{ projectId: string, reportId: string }>) {
    const { projectId, reportId } = params;
    const command = new DeleteMonitoringReportCommand(projectId, reportId);
    await contextProvider.start(params).runCommand(command);

    return true;
  }
}

export const controller = new Controller();
