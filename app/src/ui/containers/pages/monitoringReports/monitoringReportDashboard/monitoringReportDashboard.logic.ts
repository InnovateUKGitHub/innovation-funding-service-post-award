import { getFirstEdge } from "@gql/selectors/edges";
import { useLazyLoadQuery } from "react-relay";
import { monitoringReportDashboardQuery } from "./MonitoringReportDashboard.query";
import { MonitoringReportDashboardQuery } from "./__generated__/MonitoringReportDashboardQuery.graphql";
import { useMemo } from "react";
import { MonitoringReportStatus } from "@framework/constants/monitoringReportStatus";
import { ProjectStatus } from "@framework/constants/project";
import { mapToMonitoringReportDtoArray } from "@gql/dtoMapper/mapMonitoringReportDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";

const currentStatuses = [
  MonitoringReportStatus.New,
  MonitoringReportStatus.Draft,
  MonitoringReportStatus.Queried,
  MonitoringReportStatus.AwaitingApproval,
];

export type Project = {
  id: ProjectId;
  projectNumber: string;
  title: string;
  status: ProjectStatus;
};

export type MonitoringReport = {
  headerId: MonitoringReportId;
  status: MonitoringReportStatus;
  periodId: number;
  startDate: Date | null;
  endDate: Date | null;
  statusName: string;
  lastUpdated: Date | null;
  projectId: ProjectId;
};

export const useMonitoringReportDashboardQuery = (projectId: ProjectId) => {
  const data = useLazyLoadQuery<MonitoringReportDashboardQuery>(
    monitoringReportDashboardQuery,
    {
      projectId,
    },
    {
      fetchPolicy: "network-only",
    },
  );

  return useMemo(() => {
    const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

    const project = mapToProjectDto(projectNode, ["id", "projectNumber", "title", "status", "isActive"]);

    const reports = mapToMonitoringReportDtoArray(
      data?.salesforce?.uiapi?.query?.Acc_MonitoringAnswer__c?.edges ?? [],
      ["headerId", "endDate", "lastUpdated", "periodId", "startDate", "projectId", "status", "statusName"],
    );

    const reportSections = reports.reduce<{
      open: MonitoringReport[];
      archived: MonitoringReport[];
    }>(
      (result, report) => {
        if (currentStatuses.indexOf(report.status) > -1) {
          result.open.push(report);
        } else {
          result.archived.push(report);
        }
        return result;
      },
      { open: [], archived: [] },
    );

    return { project, reportSections };
  }, []);
};
