import { MonitoringReportStatus, ProjectStatus } from "@framework/constants";
import { getFirstEdge } from "@gql/selectors/edges";
import { useLazyLoadQuery } from "react-relay";
import { monitoringReportDashboardQuery } from "./MonitoringReportDashboard.query";
import {
  MonitoringReportDashboardQuery,
  MonitoringReportDashboardQuery$data,
} from "./__generated__/MonitoringReportDashboardQuery.graphql";
import { mapMonitoringReportStatus } from "@framework/util/monitoringReportStatus";
import { useMemo } from "react";
import { mapToMonitoringReportDtoArray, mapToProjectDto } from "@gql/dtoMapper";

const currentStatuses = [
  MonitoringReportStatus.New,
  MonitoringReportStatus.Draft,
  MonitoringReportStatus.Queried,
  MonitoringReportStatus.AwaitingApproval,
];

type ProjectGql = GQL.ObjectNodeSelector<MonitoringReportDashboardQuery$data, "Acc_Project__c">;

export type Project = {
  id: string;
  projectNumber: string;
  title: string;
  status: ProjectStatus;
};

export type MonitoringReport = {
  headerId: string;
  status: MonitoringReportStatus;
  periodId: number;
  startDate: Date | null;
  endDate: Date | null;
  statusName: string;
  lastUpdated: Date | null;
  projectId: string;
};

export const useMonitoringReportDashboardQuery = (projectId: string) => {
  const data = useLazyLoadQuery<MonitoringReportDashboardQuery>(monitoringReportDashboardQuery, {
    projectId,
  });

  return useMemo(() => {
    const { node: projectNode } = getFirstEdge<ProjectGql>(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

    const project = mapToProjectDto(projectNode, ["id", "projectNumber", "title", "status"]);

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
