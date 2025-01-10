import { useLazyLoadQuery } from "react-relay";
import { pcrTimeExtensionWorkflowQuery } from "./PcrTimeExtensionWorkflow.query";
import { PcrTimeExtensionWorkflowQuery } from "./__generated__/PcrTimeExtensionWorkflowQuery.graphql";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { mapPcrItemDto } from "@gql/dtoMapper/mapPcrDto";
import { PCRTimeExtensionOption } from "@framework/dtos/pcrDtos";
import { monthDifference, totalCalendarMonths } from "@shared/date-helpers";
import { useNavigate } from "react-router-dom";
import { useMessageContext } from "@ui/context/messages";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { clientsideApiClient } from "@ui/apiClient";
import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { z } from "zod";
import { TimeExtensionSchema } from "./timeExtension.zod";
import { usePcrWorkflowContext } from "../pcrItemWorkflow";

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
      "type",
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

export const useOnUpdateTimeExtension = () => {
  const navigate = useNavigate();

  const { setFetchKey, pcrId, itemId, projectId, step } = usePcrWorkflowContext();
  const { clearMessages } = useMessageContext();

  return useOnUpdate<z.output<TimeExtensionSchema>, boolean, { link: ILinkInfo }>({
    req: data =>
      clientsideApiClient.pcrs.changeDuration({
        projectId,
        pcrId,
        pcrItemId: itemId,
        pcr: {
          ...data,
          ...(typeof step === "number" ? { status: PCRItemStatus.Incomplete } : {}),
        },
      }),
    onSuccess: async function (
      _: z.output<TimeExtensionSchema>,
      __: boolean,
      context: { link: ILinkInfo } | undefined,
    ) {
      clearMessages();
      setFetchKey(k => k + 1);
      navigate(context?.link?.path ?? "");
    },
  });
};
