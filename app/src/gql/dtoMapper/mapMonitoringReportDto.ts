import {
  MonitoringReportDto,
  MonitoringReportQuestionGqlDto,
  MonitoringReportQuestionDto,
} from "@framework/dtos/monitoringReportDto";
import { groupBy } from "lodash";
import { mapMonitoringReportStatus } from "@framework/util/monitoringReportStatus";

type MonitoringReportNode = Readonly<
  Partial<{
    Id: string;
    Acc_AddComments__c: GQL.Value<string>;
    Acc_FinalMonitoringReport__c: GQL.Value<boolean>;
    Acc_MonitoringHeader__c: GQL.Value<string>;
    Acc_MonitoringReportStatus__c: {
      value: string | null;
      label: string | null;
    } | null;
    Acc_PeriodEndDate__c: GQL.Value<string>;
    Acc_PeriodStartDate__c: GQL.Value<string>;
    Acc_Project__c: GQL.Value<string>;
    Acc_ProjectPeriodNumber__c: GQL.Value<number>;
    Acc_Question__c: GQL.Value<string>;
    Acc_QuestionComments__c: GQL.Value<string>;
    LastModifiedDate: GQL.Value<string>;
    RecordType: {
      Name: GQL.Value<string>;
    } | null;
  }>
> | null;

type MonitoringReportDtoMapping = Pick<
  MonitoringReportDto,
  | "addComments"
  | "endDate"
  | "headerId"
  | "lastUpdated"
  | "periodId"
  | "projectId"
  | "startDate"
  | "status"
  | "statusName"
  | "questions"
>;

const HEADER = "Monitoring Header";
const ANSWER = "Monitoring Answer";

const updatableStatuses = ["New", "Draft", "IUK Queried"];

const headerMapper: GQL.DtoMapper<Omit<MonitoringReportDtoMapping, "questions">, MonitoringReportNode> = {
  addComments(node) {
    return node?.Acc_AddComments__c?.value ?? null;
  },
  status(node) {
    return mapMonitoringReportStatus(node?.Acc_MonitoringReportStatus__c?.value ?? "unknown");
  },
  headerId(node) {
    return (
      node?.RecordType?.Name?.value === ANSWER
        ? node?.Acc_MonitoringHeader__c?.value ?? "unknown-monitoring-report-id"
        : node?.Id ?? ""
    ) as MonitoringReportId;
  },
  periodId(node) {
    return (node?.Acc_ProjectPeriodNumber__c?.value ?? 0) as PeriodId;
  },
  startDate(node) {
    return !!node?.Acc_PeriodStartDate__c?.value ? new Date(node?.Acc_PeriodStartDate__c?.value) : null;
  },
  endDate(node) {
    return !!node?.Acc_PeriodEndDate__c?.value ? new Date(node?.Acc_PeriodEndDate__c?.value) : null;
  },
  statusName(node) {
    return node?.Acc_MonitoringReportStatus__c?.label ?? "unknown-status";
  },
  lastUpdated(node) {
    return !!node?.LastModifiedDate?.value ? new Date(node?.LastModifiedDate?.value) : null;
  },
  projectId(node) {
    return (node?.Acc_Project__c?.value ?? "") as ProjectId;
  },
};

/**
 * Maps a specified Monitoring Report Node from a GQL query to a slice of
 * the MonitoringReportDto to ensure consistency and compatibility in the application
 */
export function mapToMonitoringReportDto<
  T extends MonitoringReportNode,
  TPickList extends keyof MonitoringReportDtoMapping,
>(node: T, pickList: TPickList[]): Pick<MonitoringReportDtoMapping, TPickList> {
  return pickList.reduce((dto, field) => {
    if (field === "questions") return dto;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore don't know how to let it know that "questions" will never be applied here
    dto[field] = headerMapper[field as Exclude<TPickList, "questions">](node);
    return dto;
  }, {} as Pick<MonitoringReportDtoMapping, TPickList>);
}

/**
 * Maps edges to array of MonitoringReport DTOs.
 */
export function mapToMonitoringReportDtoArray<
  T extends ReadonlyArray<{ node: MonitoringReportNode } | null> | null,
  TPickList extends keyof MonitoringReportDtoMapping,
>(edges: T, pickList: TPickList[]): Pick<MonitoringReportDtoMapping, TPickList>[] {
  return (
    edges?.map(x => {
      return mapToMonitoringReportDto(x?.node ?? null, pickList);
    }) ?? []
  );
}

/**
 * gets the Active questions for monitoring reports that can be edited, or
 * the Answered questions for readonly monitoring report
 */
function getQuestions(
  header: Pick<MonitoringReportDto, "statusName">,
  results: ({ node: MonitoringReportNode | null } | null)[],
  questions: Pick<
    MonitoringReportQuestionGqlDto,
    "isActive" | "title" | "displayOrder" | "id" | "isScored" | "description" | "options"
  >[],
) {
  if (updatableStatuses.includes(header.statusName)) {
    // map Active Questions
    const mappedQuestions = groupBy(
      questions.filter(x => x.isActive).sort((a, b) => a.displayOrder - b.displayOrder),
      "displayOrder",
    );

    const activeQuestions = Object.values(mappedQuestions).map(options => ({
      title: options[0].title,
      displayOrder: options[0].displayOrder,
      optionId: !options[0].isScored ? options[0].id : null,
      responseId: null,
      comments: null,
      description: options[0].description,
      isScored: options[0].isScored,
      options: options
        .map(o => {
          return {
            id: o.options[0].id,
            questionText: o.options[0].questionText,
            questionScore: o.options[0].questionScore,
          };
        })
        // The options should be displayed in descending score order (largest at the top of the list of options)
        .sort((a, b) => b.questionScore - a.questionScore),
    }));

    return activeQuestions;
  }

  // Gets the answered questions
  const questionIds = results.map(x => x?.node?.Acc_Question__c?.value);

  return questions
    .filter(x => questionIds.includes(x.id))
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map(x => ({
      ...x,
      optionId: null,
      responseId: null,
      comments: null,
    }));
}

/**
 * maps comments and ids onto the monitoring report questions
 */
function populateAnswer<T extends Pick<MonitoringReportQuestionDto, "options">>(
  question: T,
  results: ({ node: MonitoringReportNode | null } | null)[],
): T {
  const options = question.options.map(o => o.id);
  // if there are no options get it from the preselected answer as its a non-option question
  const response = (results ?? []).find(r => options.includes(r?.node?.Acc_Question__c?.value ?? "unknown"));

  if (!response) {
    return question;
  }

  return Object.assign(question, {
    optionId: response?.node?.Acc_Question__c?.value ?? null,
    comments: response?.node?.Acc_QuestionComments__c?.value ?? null,
    responseId: response?.node?.Id,
  });
}

/**
 * maps monitoring report data to the header and linked questions
 */
export function mapToFullMonitoringReport<
  T extends ReadonlyArray<{ node: MonitoringReportNode } | null> | null,
  TPickList extends keyof MonitoringReportDtoMapping,
>(
  edges: T,
  pickList: "statusName" extends TPickList ? TPickList[] : never, // It is required to pass in the "statusName" to the picklist
  additionalData: {
    questions: Pick<
      MonitoringReportQuestionGqlDto,
      "isActive" | "title" | "displayOrder" | "id" | "isScored" | "description" | "options"
    >[];
  },
): Pick<MonitoringReportDtoMapping, TPickList> {
  if (!pickList.includes("statusName" as TPickList)) {
    throw new Error("statusName is a required field for fetching the full monitoring report");
  }
  const headerGql = edges && edges.length > 1 && edges.find(x => x?.node?.RecordType?.Name?.value === HEADER);
  if (!headerGql) throw new Error("Invalid Monitoring Report Request - no matching Header");
  const header = mapToMonitoringReportDto(headerGql.node, pickList);

  const results = (edges ?? []).filter(x => x?.node?.RecordType?.Name?.value === ANSWER);

  const questions = getQuestions(
    header as Pick<MonitoringReportDto, "statusName">,
    results,
    additionalData.questions,
  ).map(x => populateAnswer(x, results));

  return {
    ...header,
    questions,
  };
}
