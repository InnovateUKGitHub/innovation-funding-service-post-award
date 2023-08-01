import { MonitoringReportStatusChangeDto } from "@framework/dtos/monitoringReportDto";
import { mapMonitoringReportStatus } from "@framework/util/monitoringReportStatus";

import { Clock } from "@framework/util/clock";

const clock = new Clock();

// on Acc_StatusChange__c
type MonitoringReportStatusChangeNode = Readonly<Partial<{
  Id: string;
  Acc_MonitoringReport__c: GQL.Value<string>;
  Acc_NewMonitoringReportStatus__c: GQL.Value<string>;
  Acc_PreviousMonitoringReportStatus__c: GQL.Value<string>;
  Acc_ExternalComment__c: GQL.Value<string>;
  Acc_CreatedByAlias__c: GQL.Value<string>;
  CreatedDate: GQL.Value<string>;
}> | null> | null;

const mapper: GQL.DtoMapper<MonitoringReportStatusChangeDto, MonitoringReportStatusChangeNode> = {
  id(node) {
    return node?.Id ?? "unknown";
  },
  monitoringReport(node) {
    return node?.Acc_MonitoringReport__c?.value ?? "unknown";
  },
  comments(node) {
    return node?.Acc_ExternalComment__c?.value ?? "";
  },
  previousStatus(node) {
    return mapMonitoringReportStatus(node?.Acc_PreviousMonitoringReportStatus__c?.value ?? "unknown");
  },
  previousStatusLabel(node) {
    return node?.Acc_PreviousMonitoringReportStatus__c?.value ?? "unknown";
  },
  newStatus(node) {
    return mapMonitoringReportStatus(node?.Acc_NewMonitoringReportStatus__c?.value ?? "unknown");
  },
  newStatusLabel(node) {
    return node?.Acc_NewMonitoringReportStatus__c?.value ?? "unknown";
  },
  createdBy(node) {
    return node?.Acc_CreatedByAlias__c?.value ?? "unknown";
  },
  createdDate(node) {
    return node?.CreatedDate?.value ? clock.parseRequiredSalesforceDateTime(node?.CreatedDate?.value) : new Date(NaN);
  },
};

/**
 * Maps a specified MonitoringReportStatusChange Node from a GQL query to
 * the MonitoringReportStatusChangeDto to ensure consistency and compatibility in the application
 */
export function mapToMonitoringReportStatusChangeDto<
  T extends MonitoringReportStatusChangeNode,
  PickList extends keyof MonitoringReportStatusChangeDto,
>(node: T, pickList: PickList[]): Pick<MonitoringReportStatusChangeDto, PickList> {
  return pickList.reduce((dto, field) => {
    dto[field] = mapper[field](node);
    return dto;
  }, {} as Pick<MonitoringReportStatusChangeDto, PickList>);
}

/**
 * Maps MonitoringReportStatusChanged Edge to array of MonitoringReportStatusChange DTOs.
 */
export function mapToMonitoringReportStatusChangeDtoArray<
  T extends ReadonlyArray<{ node: MonitoringReportStatusChangeNode } | null> | null,
  PickList extends keyof MonitoringReportStatusChangeDto,
>(edges: T, pickList: PickList[]): Pick<MonitoringReportStatusChangeDto, PickList>[] {
  return (
    edges?.map(node => {
      return mapToMonitoringReportStatusChangeDto(node?.node ?? null, pickList);
    }) ?? []
  );
}
