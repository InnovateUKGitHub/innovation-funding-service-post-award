import { useLazyLoadQuery } from "react-relay";
import { pcrTimeExtensionWorkflowQuery } from "./PcrTimeExtensionWorkflow.query";
import { PcrTimeExtensionWorkflowQuery } from "./__generated__/PcrTimeExtensionWorkflowQuery.graphql";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { mapPcrItemDto } from "@gql/dtoMapper/mapPcrDto";
import { PCRTimeExtensionOption } from "@framework/dtos/pcrDtos";
import { monthDifference, totalCalendarMonths } from "@shared/date-helpers";

export const usePcrTimeExtensionWorkflowQuery = (projectId: ProjectId, pcrItemId: PcrItemId, fetchKey: number) => {
  const data = useLazyLoadQuery<PcrTimeExtensionWorkflowQuery>(
    pcrTimeExtensionWorkflowQuery,
    {
      projectId,
      pcrItemId,
    },
    {
      fetchPolicy: "network-only",
      fetchKey,
    },
  );

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

  const project = mapToProjectDto(projectNode, ["projectNumber", "status", "title", "endDate", "startDate"]);

  const { node: pcrNode } = getFirstEdge(projectNode?.Project_Change_Requests__r?.edges ?? []);

  const pcrItem = mapPcrItemDto(
    pcrNode,
    [
      "id",
      "lastUpdated",
      "projectId",
      "requestNumber",
      "started",
      "status",
      "statusName",
      "offsetMonths",
      "projectDurationSnapshot",
    ],
    {},
  );

  return { project, pcrItem };
};

/**
 * creates a label from the date
 * @param {Date} dateToParse the date from which we want the label
 * @returns {string} date label
 */
function createLabelFromDate(dateToParse: Date): string {
  const dateValue = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" });

  return dateValue.format(dateToParse);
}

/**
 * generates the allowed time extension options
 * @param {Date} endDate the end date for project
 * @param {number} maxFutureLimitInYears max number of years for project
 * @returns {PCRTimeExtensionOption[]} array of time extension options
 */
export function generateOptions(endDate: Date, maxFutureLimitInYears: number): PCRTimeExtensionOption[] {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const initialOffset = monthDifference(endDate, currentDate);

  const totalPreviousMonths = Math.abs(initialOffset);
  const currentProjectCount = 1; // Note: We want to include this in list as the initial option
  const totalFutureMonths = totalCalendarMonths * maxFutureLimitInYears;

  const combinedOptionCount = totalPreviousMonths + currentProjectCount + totalFutureMonths;

  return Array.from({ length: combinedOptionCount }, (_, monthCount) => {
    const optionDate = new Date(currentYear, currentMonth + monthCount, 0);

    return {
      label: createLabelFromDate(optionDate),
      offset: initialOffset + monthCount,
    };
  });
}
