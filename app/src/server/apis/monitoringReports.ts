import { MonitoringReportDto, MonitoringReportSummaryDto } from "@framework/dtos/monitoringReportDto";
import { contextProvider } from "@server/features/common/contextProvider";
import { CreateMonitoringReportCommand } from "@server/features/monitoringReports/createMonitoringReport";
import { DeleteMonitoringReportCommand } from "@server/features/monitoringReports/deleteMonitoringReport";
import { processDto } from "../../shared/processResponse";
import { GetMonitoringReportById } from "../features/monitoringReports/getMonitoringReport";
import { SaveMonitoringReport } from "../features/monitoringReports/saveMonitoringReport";
import { ApiParams, ControllerBaseWithSummary } from "./controllerBase";

export interface IMonitoringReportsApi<Context extends "client" | "server"> {
  createMonitoringReport: (
    params: ApiParams<
      Context,
      { monitoringReportDto: Pick<MonitoringReportDto, "periodId" | "projectId" | "status">; submit: boolean }
    >,
  ) => Promise<MonitoringReportDto>;
  saveMonitoringReport: (
    params: ApiParams<
      Context,
      { monitoringReportDto: PickRequiredFromPartial<MonitoringReportDto, "projectId" | "headerId">; submit: boolean }
    >,
  ) => Promise<MonitoringReportDto>;
  deleteMonitoringReport: (
    params: ApiParams<Context, { projectId: ProjectId; reportId: MonitoringReportId }>,
  ) => Promise<boolean>;
}

class Controller
  extends ControllerBaseWithSummary<"server", MonitoringReportSummaryDto, MonitoringReportDto>
  implements IMonitoringReportsApi<"server">
{
  constructor() {
    super("monitoring-reports");

    this.postItem(
      "/",
      (p, q, b) => ({ monitoringReportDto: processDto(b), submit: q.submit === "true" }),
      p => this.createMonitoringReport(p),
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
  }

  public async saveMonitoringReport(
    params: ApiParams<
      "server",
      { monitoringReportDto: PickRequiredFromPartial<MonitoringReportDto, "projectId" | "headerId">; submit: boolean }
    >,
  ) {
    const { monitoringReportDto, submit } = params;
    const context = await contextProvider.start(params);

    await context.runCommand(new SaveMonitoringReport(monitoringReportDto as MonitoringReportDto, submit));
    return context.runQuery(new GetMonitoringReportById(monitoringReportDto.projectId, monitoringReportDto.headerId));
  }

  public async createMonitoringReport(
    params: ApiParams<
      "server",
      { monitoringReportDto: Pick<MonitoringReportDto, "periodId" | "projectId" | "status">; submit: boolean }
    >,
  ) {
    const { monitoringReportDto, submit } = params;
    const context = await contextProvider.start(params);

    const id = (await context.runCommand(
      new CreateMonitoringReportCommand(monitoringReportDto, submit),
    )) as MonitoringReportId;
    return context.runQuery(new GetMonitoringReportById(monitoringReportDto.projectId, id));
  }

  public async deleteMonitoringReport(
    params: ApiParams<"server", { projectId: ProjectId; reportId: MonitoringReportId }>,
  ) {
    const { projectId, reportId } = params;
    const context = await contextProvider.start(params);
    const command = new DeleteMonitoringReportCommand(projectId, reportId);
    await context.runCommand(command);

    return true;
  }
}

export const controller = new Controller();
