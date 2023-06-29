import { apiClient } from "@ui/apiClient";
import { Pending } from "@shared/pending";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { ProjectsStore } from "./projectsStore";
import { StoreBase } from "./storeBase";
import { LoadingStatus } from "@framework/constants/enums";
import { MonitoringReportStatus } from "@framework/constants/monitoringReportStatus";
import { MonitoringReportSummaryDto, MonitoringReportDto } from "@framework/dtos/monitoringReportDto";
import { MonitoringReportDtoValidator } from "@ui/validation/validators/MonitoringReportDtoValidator";
import { dataLoadAction } from "../actions/common/dataLoad";
import { messageSuccess } from "../actions/common/messageActions";
import { RootActionsOrThunk } from "../actions/root";
import { RootState } from "../reducers/rootReducer";

export class MonitoringReportsStore extends StoreBase {
  constructor(
    private readonly projectStore: ProjectsStore,
    protected getState: () => RootState,
    protected queue: (action: RootActionsOrThunk) => void,
  ) {
    super(getState, queue);
  }

  private getKey(projectId: ProjectId, reportId: MonitoringReportId | undefined) {
    return storeKeys.getMonitoringReportKey(projectId, reportId);
  }

  getStatusChanges(projectId: ProjectId, reportId: MonitoringReportId) {
    return this.getData("monitoringReportStatusChanges", this.getKey(projectId, reportId), p =>
      apiClient.monitoringReports.getStatusChanges({ projectId, reportId, ...p }),
    );
  }

  getAllForProject(projectId: ProjectId): Pending<MonitoringReportSummaryDto[]> {
    return this.getData("monitoringReports", storeKeys.getProjectKey(projectId), p =>
      apiClient.monitoringReports.getAllForProject({ projectId, ...p }),
    );
  }

  getById(projectId: ProjectId, reportId: MonitoringReportId) {
    return this.getData("monitoringReport", this.getKey(projectId, reportId), p =>
      apiClient.monitoringReports.get({ projectId, reportId, ...p }),
    );
  }

  getMonitoringReportQuestions() {
    return this.getData("monitoringReportQuestions", "all", p =>
      apiClient.monitoringReports.getActiveQuestions({ ...p }),
    );
  }

  getCreateMonitoringReportEditor(projectId: ProjectId, init?: (dto: MonitoringReportDto) => void) {
    return this.getEditor(
      "monitoringReport",
      this.getKey(projectId, undefined),
      () =>
        this.getMonitoringReportQuestions().then<MonitoringReportDto>(questions => ({
          headerId: "" as MonitoringReportId,
          startDate: new Date(),
          endDate: new Date(),
          status: MonitoringReportStatus.Draft,
          statusName: "",
          lastUpdated: new Date(),
          periodId: NaN as PeriodId,
          projectId,
          questions,
          addComments: "",
        })),
      init,
      dto => this.getValidator(projectId, dto, false, false),
    );
  }

  getUpdateMonitoringReportEditor(
    projectId: ProjectId,
    reportId: MonitoringReportId,
    init?: (dto: MonitoringReportDto) => void,
  ) {
    return this.getEditor(
      "monitoringReport",
      this.getKey(projectId, reportId),
      () => this.getById(projectId, reportId),
      init,
      dto => this.getValidator(projectId, dto, false, false),
    );
  }

  updateMonitoringReportEditor(
    saving: boolean,
    projectId: ProjectId,
    dto: MonitoringReportDto,
    submit?: boolean,
    onComplete?: (dto: MonitoringReportDto) => void,
  ) {
    // if submit isn't supplied need to get it from the last validator to keep it insync
    const key = this.getKey(projectId, dto.headerId);
    const isSubmitting =
      (submit === undefined && this.getState().editors.monitoringReport[key]
        ? this.getState().editors.monitoringReport[key].validator.submit
        : submit) || false;

    this.updateEditor(
      saving,
      "monitoringReport",
      key,
      dto,
      show => this.getValidator(projectId, dto, isSubmitting, show),
      p => {
        if (dto.headerId) {
          return apiClient.monitoringReports.saveMonitoringReport({
            monitoringReportDto: dto,
            submit: isSubmitting,
            ...p,
          });
        } else {
          return apiClient.monitoringReports.createMonitoringReport({
            monitoringReportDto: dto,
            submit: isSubmitting,
            ...p,
          });
        }
      },
      result => {
        this.queue(dataLoadAction("monitoringReport", result.headerId, LoadingStatus.Updated, result));

        this.markStale("monitoringReports", projectId, undefined);

        if (onComplete) {
          onComplete(result);
        }
      },
    );
  }

  deleteReport(
    projectId: ProjectId,
    reportId: MonitoringReportId,
    dto: MonitoringReportDto,
    message: string,
    onComplete: () => void,
  ) {
    this.deleteEditor(
      "monitoringReport",
      this.getKey(projectId, reportId),
      dto,
      () => this.getValidator(projectId, dto, false, false),
      p => apiClient.monitoringReports.deleteMonitoringReport({ reportId, projectId, ...p }),
      () => {
        this.queue(messageSuccess(message));
        onComplete();
      },
    );
  }

  private getValidator(projectId: ProjectId, dto: MonitoringReportDto, submit: boolean, showErrors: boolean) {
    const combined = Pending.combine({
      questions: this.getMonitoringReportQuestions(),
      maxPeriodId: this.projectStore.getById(projectId).then(x => x.periodId),
    });

    return combined.then(
      ({ questions, maxPeriodId }) => new MonitoringReportDtoValidator(dto, showErrors, submit, questions, maxPeriodId),
    );
  }
}
