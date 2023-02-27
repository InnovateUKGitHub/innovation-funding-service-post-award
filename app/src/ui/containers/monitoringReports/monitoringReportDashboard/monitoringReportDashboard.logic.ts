import { MonitoringReportStatus, ProjectStatus } from "@framework/constants";
import { getProjectStatus } from "@framework/util/projectStatus";
import { getFirstEdge } from "@gql/selectors/edges";
import { useLazyLoadQuery } from "react-relay";
import { monitoringReportDashboardQuery } from "./MonitoringReportDashboard.query";
import {
  MonitoringReportDashboardQuery,
  MonitoringReportDashboardQuery$data,
} from "./__generated__/MonitoringReportDashboardQuery.graphql";
import { mapMonitoringReportStatus } from "@framework/util/monitoringReportStatus";
import { useMemo } from "react";

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

    const project = {
      id: projectNode?.Id ?? "unknown-project-id",
      projectNumber: projectNode?.Acc_ProjectNumber__c?.value ?? "",
      title: projectNode?.Acc_ProjectTitle__c?.value ?? "",
      status: getProjectStatus(projectNode?.Acc_ProjectStatus__c?.value ?? "unknown"),
    };

    const reportsGql = data?.salesforce?.uiapi?.query?.Acc_MonitoringAnswer__c?.edges;

    const reports: MonitoringReport[] =
      reportsGql?.map(x => ({
        status: mapMonitoringReportStatus(x?.node?.Acc_MonitoringReportStatus__c?.value ?? "unknown"),
        headerId: x?.node?.Id ?? "",
        periodId: x?.node?.Acc_ProjectPeriodNumber__c?.value ?? 0,
        startDate: new Date(x?.node?.Acc_PeriodStartDate__c?.value ?? ""),
        endDate: new Date(x?.node?.Acc_PeriodEndDate__c?.value ?? ""),
        statusName: x?.node?.Acc_MonitoringReportStatus__c?.label ?? "unknown",
        lastUpdated: new Date(x?.node?.LastModifiedDate?.value ?? ""),
        projectId: x?.node?.Acc_Project__c?.value ?? "",
      })) ?? [];

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
