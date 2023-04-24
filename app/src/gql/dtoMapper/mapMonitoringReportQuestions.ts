import type { MonitoringReportQuestionGqlDto, MonitoringReportOptionDto } from "@framework/dtos";

type MonitoringReportQuestionNode = Readonly<
  Partial<{
    Id: string;
    Acc_QuestionName__c: GQL.Value<string>;
    Acc_DisplayOrder__c: GQL.Value<number>;
    Acc_QuestionScore__c: GQL.Value<number>;
    Acc_QuestionText__c: GQL.Value<string>;
    Acc_QuestionDescription__c: GQL.Value<string>;
    Acc_ActiveFlag__c: GQL.Value<boolean>;
    Acc_ScoredQuestion__c: GQL.Value<boolean>;
  }>
> | null;

type MonitoringReportQuestionMapping = Pick<
  MonitoringReportQuestionGqlDto,
  "description" | "displayOrder" | "isScored" | "options" | "title" | "isActive" | "id"
>;

const mapper: GQL.DtoMapper<MonitoringReportQuestionMapping, MonitoringReportQuestionNode> = {
  description(node) {
    return node?.Acc_QuestionDescription__c?.value ?? null;
  },
  displayOrder(node) {
    return node?.Acc_DisplayOrder__c?.value ?? 0;
  },
  id(node) {
    return node?.Id ?? null;
  },
  isActive(node) {
    return node?.Acc_ActiveFlag__c?.value ?? false;
  },
  isScored(node) {
    return node?.Acc_ScoredQuestion__c?.value ?? false;
  },
  options(node) {
    return [
      {
        id: node?.Id ?? "unknown id",
        questionText: node?.Acc_QuestionText__c?.value ?? "unknown question",
        questionScore: node?.Acc_QuestionScore__c?.value ?? 0,
      } as MonitoringReportOptionDto,
    ];
  },
  title(node) {
    return node?.Acc_QuestionName__c?.value ?? "unknown";
  },
};

/**
 *
 * Maps monitoring report questions raw gql response to the monitoring report question dto
 */
export function mapToMonitoringReportQuestionDto<
  T extends MonitoringReportQuestionNode,
  PickList extends keyof MonitoringReportQuestionMapping,
>(node: T, pickList: PickList[]): Pick<MonitoringReportQuestionMapping, PickList> {
  return pickList.reduce((dto, field) => {
    dto[field] = mapper[field](node);
    return dto;
  }, {} as Pick<MonitoringReportQuestionMapping, PickList>);
}

/**
 * Maps monitoring report edges to array of MonitoringReport DTOs.
 */
export function mapToMonitoringReportQuestionDtoArray<
  T extends ReadonlyArray<{ node: MonitoringReportQuestionNode } | null> | null,
  PickList extends keyof MonitoringReportQuestionMapping,
>(edges: T, pickList: PickList[]): Pick<MonitoringReportQuestionMapping, PickList>[] {
  return (
    edges?.map(x => {
      return mapToMonitoringReportQuestionDto(x?.node ?? null, pickList);
    }) ?? []
  );
}
