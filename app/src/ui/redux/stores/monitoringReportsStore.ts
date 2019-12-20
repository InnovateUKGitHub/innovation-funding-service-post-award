import { StoreBase } from "./storeBase";
import { ProjectsStore } from "./projectsStore";
import { RootState } from "../reducers";
import { scrollToTheTopSmoothly } from "@framework/util";
import { ApiClient } from "@ui/apiClient";
import { LoadingStatus, Pending } from "@shared/pending";
import { MonitoringReportDto, MonitoringReportSummaryDto } from "@framework/dtos";
import { MonitoringReportStatus } from "@framework/types";
import { dataLoadAction, handleEditorError, handleEditorSubmit, handleEditorSuccess, messageSuccess } from "../actions";
import { MonitoringReportDtoValidator } from "@ui/validators";
import { storeKeys } from "@ui/redux/stores/storeKeys";

export class MonitoringReportsStore extends StoreBase {
  constructor(private projectStore: ProjectsStore, protected getState: () => RootState, protected queue: (action: any) => void) {
    super(getState, queue);
  }

  private getKey(projectId: string, reportId: string|undefined) {
    return storeKeys.getMonitoringReportKey(projectId, reportId);
  }

  getStatusChanges(projectId: string, reportId: string) {
    return this.getData(
      "monitoringReportStatusChanges",
      this.getKey(projectId, reportId),
      (p) => ApiClient.monitoringReports.getStatusChanges({ projectId, reportId, ...p })
    );
  }

  getAllForProject(projectId: string): Pending<MonitoringReportSummaryDto[]> {
    return this.getData(
      "monitoringReports",
      storeKeys.getProjectKey(projectId),
      p => ApiClient.monitoringReports.getAllForProject({ projectId, ...p })
    );
  }

  getById(projectId: string, reportId: string) {
    return this.getData(
      "monitoringReport",
      this.getKey(projectId, reportId),
      (p) => ApiClient.monitoringReports.get({ projectId, reportId, ...p })
    );
  }

  getMonitoringReportQuestions() {
    return this.getData(
      "monitoringReportQuestions",
      "all",
      (p) => ApiClient.monitoringReports.getActiveQuestions({ ...p })
    );
  }

  getCreateMonitoringReportEditor(projectId: string, init?: (dto: MonitoringReportDto) => void) {
    return this.getEditor(
      "monitoringReport",
      this.getKey(projectId, undefined),
      () => this.getMonitoringReportQuestions().then<MonitoringReportDto>(questions => ({
        headerId: "",
        startDate: new Date(),
        endDate: new Date(),
        status: MonitoringReportStatus.Draft,
        statusName: "",
        lastUpdated: new Date(),
        periodId: NaN,
        projectId,
        questions,
      }
      )),
      init,
      (dto) => this.getValidator(projectId, dto, false, false)
    );
  }

  getUpdateMonitoringReportEditor(projectId: string, reportId: string, init?: (dto: MonitoringReportDto) => void) {
    return this.getEditor(
      "monitoringReport",
      this.getKey(projectId, reportId),
      () => this.getById(projectId, reportId),
      init,
      (dto) => this.getValidator(projectId, dto, false, false)
    );
  }

  updateMonitoringReportEditor(saving: boolean, projectId: string, dto: MonitoringReportDto, submit?: boolean, onComplete?: (dto: MonitoringReportDto) => void) {
    // if submit isn't supplied need to get it from the last validator to keep it insync
    const key = this.getKey(projectId, dto.headerId);
    const isSubmitting = (submit === undefined && this.getState().editors.monitoringReport[key] ? this.getState().editors.monitoringReport[key].validator.submit : submit) || false;

    this.updateEditor(
      saving,
      "monitoringReport",
      key,
      dto,
      (show) => this.getValidator(projectId, dto, isSubmitting, show),
      (p) => {
        if(dto.headerId) {
          return ApiClient.monitoringReports.saveMonitoringReport({ monitoringReportDto: dto, submit: isSubmitting, ...p });
        }
        else {
          return ApiClient.monitoringReports.createMonitoringReport({ monitoringReportDto: dto, submit: isSubmitting, ...p });
        }
      },
      (result) => {
        this.queue(dataLoadAction("monitoringReport", result.headerId, LoadingStatus.Updated, result));

        this.markStale("monitoringReports", projectId, undefined);

        scrollToTheTopSmoothly();

        if (onComplete) {
          onComplete(result);
        }
      }
    );
  }

  deleteReport(projectId: string, reportId: string, dto: MonitoringReportDto, message: string, onComplete: () => void) {
    this.deleteEditor(
      "monitoringReport",
      this.getKey(projectId, reportId),
      dto,
      () => this.getValidator(projectId, dto, false, false),
      p => ApiClient.monitoringReports.deleteMonitoringReport({ reportId, projectId, ...p}),
      () => {
        this.queue(messageSuccess(message));
        onComplete();
      }
    );
  }

  private getValidator(projectId: string, dto: MonitoringReportDto, submit: boolean, showErrors: boolean) {
    const combined = Pending.combine({
      questions: this.getMonitoringReportQuestions(),
      maxPeriodId: this.projectStore.getById(projectId).then(x => x.periodId)
    });

    return combined.then(({ questions, maxPeriodId }) => new MonitoringReportDtoValidator(dto, showErrors, submit, questions, maxPeriodId));
  }
}
