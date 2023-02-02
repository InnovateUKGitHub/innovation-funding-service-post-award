import type { MonitoringReportDto } from "@framework/dtos";
import { mapMonitoringReportStatus } from "@framework/util/monitoringReportStatus";

type MonitoringReportNode = Readonly<
  Partial<{
    Id: string;
    Acc_FinalMonitoringReport__c: GQL.Value<boolean>;
    Acc_MonitoringReportStatus__c: {
      value: string | null;
      label: string | null;
    } | null;
    Acc_PeriodEndDate__c: GQL.Value<string>;
    Acc_PeriodStartDate__c: GQL.Value<string>;
    Acc_Project__c: GQL.Value<string>;
    Acc_ProjectPeriodNumber__c: GQL.Value<number>;
    LastModifiedDate: GQL.Value<string>;
  }>
> | null;

type MonitoringReportDtoMapping = Pick<
  MonitoringReportDto,
  "endDate" | "headerId" | "endDate" | "lastUpdated" | "periodId" | "projectId" | "startDate" | "status" | "statusName"
>;

const mapper: GQL.DtoMapper<MonitoringReportDtoMapping, MonitoringReportNode> = {
  status: function (node) {
    return mapMonitoringReportStatus(node?.Acc_MonitoringReportStatus__c?.value ?? "unknown");
  },

  headerId: function (node) {
    return (node?.Id ?? "") as MonitoringReportId;
  },
  periodId: function (node) {
    return node?.Acc_ProjectPeriodNumber__c?.value ?? 0;
  },
  startDate: function (node) {
    return !!node?.Acc_PeriodStartDate__c?.value ? new Date(node?.Acc_PeriodStartDate__c?.value) : null;
  },
  endDate: function (node) {
    return !!node?.Acc_PeriodEndDate__c?.value ? new Date(node?.Acc_PeriodEndDate__c?.value) : null;
  },
  statusName: function (node) {
    return node?.Acc_MonitoringReportStatus__c?.label ?? "unknown";
  },
  lastUpdated: function (node) {
    return !!node?.LastModifiedDate?.value ? new Date(node?.LastModifiedDate?.value) : null;
  },
  projectId: function (node) {
    return (node?.Acc_Project__c?.value ?? "") as ProjectId;
  },
};

/**
 * Maps a specified Monitoring Report Node from a GQL query to a slice of
 * the MonitoringReportDto to ensure consistency and compatibility in the application
 */
export function mapToMonitoringReportDto<
  T extends MonitoringReportNode,
  PickList extends keyof MonitoringReportDtoMapping,
>(node: T, pickList: PickList[]): Pick<MonitoringReportDtoMapping, PickList> {
  return pickList.reduce((dto, field) => {
    dto[field] = mapper[field](node);
    return dto;
  }, {} as Pick<MonitoringReportDtoMapping, PickList>);
}

/**
 * Maps claim edges to array of MonitoringReport DTOs.
 */
export function mapToMonitoringReportDtoArray<
  T extends ReadonlyArray<{ node: MonitoringReportNode } | null> | null,
  PickList extends keyof MonitoringReportDtoMapping,
>(edges: T, pickList: PickList[]): Pick<MonitoringReportDtoMapping, PickList>[] {
  return (
    edges?.map(x => {
      return mapToMonitoringReportDto(x?.node ?? null, pickList);
    }) ?? []
  );
}
