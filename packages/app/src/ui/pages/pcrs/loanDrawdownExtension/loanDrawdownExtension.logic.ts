import { useLazyLoadQuery } from "react-relay";
import { loanDrawdownExtensionQuery } from "./LoanDrawdownExtension.query";
import { LoanDrawdownExtensionQuery } from "./__generated__/LoanDrawdownExtensionQuery.graphql";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { mapPcrItemDto } from "@gql/dtoMapper/mapPcrDto";
import { DateTime } from "luxon";
import { ContentSelector } from "@copy/type";
import { useNavigate } from "react-router-dom";
import { usePcrWorkflowContext } from "../pcrItemWorkflow";
import { useMessageContext } from "@ui/context/messages";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { z } from "zod";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { clientsideApiClient } from "@ui/apiClient";
import { LoanDrawdownExtensionSchemaType } from "./loanDrawdownExtension.zod";
import { PCRItemStatus } from "@framework/constants/pcrConstants";

export const quarterlyOffset = 3;

export const useLoanDrawdownExtensionQuery = (projectId: ProjectId, pcrItemId: PcrItemId, fetchKey: number) => {
  const data = useLazyLoadQuery<LoanDrawdownExtensionQuery>(
    loanDrawdownExtensionQuery,
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
  const { node: pcrNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_ProjectChangeRequest__c?.edges);
  const project = mapToProjectDto(projectNode, ["projectNumber", "status", "title", "roles", "numberOfPeriods"]);

  const pcrItem = mapPcrItemDto(
    pcrNode,
    [
      "availabilityPeriod",
      "availabilityPeriodChange",
      "extensionPeriod",
      "extensionPeriodChange",
      "projectStartDate",
      "repaymentPeriod",
      "repaymentPeriodChange",
      "status",
      "type",
    ],
    {},
  );

  return { project, pcrItem, fragmentRef: data?.salesforce?.uiapi };
};

export const calculateOffsetDate = (offset: number, projectStartDate: Date | null): Date => {
  const startingDate = projectStartDate;
  if (startingDate === null) {
    throw new Error("Cannot calculate offset date of null");
  }

  if (offset === 0) return startingDate;

  const internalDate = DateTime.fromJSDate(startingDate).setZone("Europe/London");
  const offsetDate = internalDate.plus({ months: offset });

  return offsetDate.toJSDate();
};

export const getQuarterInMonths = (totalMonths: number): number => totalMonths / 3;

const createDurationOption = (value: number, getContent: (contentSelector: string | ContentSelector) => string) => {
  return {
    id: String(value),
    value: getContent(x => x.pcrLoanExtensionLabels.quarters({ count: getQuarterInMonths(value) })),
  };
};

/**
 * Creates a list of options
 */
export function createOptions(
  currentOffset: number,
  totalMonths: number,
  getContent: (contentSelector: string | ContentSelector) => string,
) {
  // Note: Capture any current options which are less than "quarterlyOffset" or not modulo of 3
  const shouldAddStartOption = currentOffset < quarterlyOffset;

  const list = [];

  if (shouldAddStartOption) list.push(createDurationOption(currentOffset, getContent));

  for (let newOffset = quarterlyOffset; newOffset <= totalMonths; newOffset += quarterlyOffset) {
    const notCurrentIndex = currentOffset !== newOffset;
    const optionDoesNotExist = currentOffset >= newOffset;
    const shouldAddDefaultOption = currentOffset - newOffset === currentOffset % quarterlyOffset;
    const shouldAddMiddleOption = optionDoesNotExist && shouldAddDefaultOption;

    if (notCurrentIndex) list.push(createDurationOption(newOffset, getContent));
    if (shouldAddMiddleOption) list.push(createDurationOption(currentOffset, getContent));
  }

  return list;
}

export type LoanDrawdownExtensionErrors = {
  loanDrawdownExtension: RhfError;
  availabilityPeriodChange: RhfError;
  extensionPeriodChange: RhfError;
  repaymentPeriodChange: RhfError;
};

export const useOnUpdateLoanDrawdownExtension = () => {
  const navigate = useNavigate();

  const { setFetchKey, pcrId, itemId, projectId, step } = usePcrWorkflowContext();
  const { clearMessages } = useMessageContext();

  return useOnUpdate<z.output<LoanDrawdownExtensionSchemaType>, boolean, { link: ILinkInfo }>({
    req: data =>
      clientsideApiClient.pcrs.loanDrawdownExtension({
        projectId,
        pcrId,
        pcrItemId: itemId,
        pcr: {
          ...data,
          form: data.form,
          ...(typeof step === "number" ? { status: PCRItemStatus.Incomplete } : {}),
        },
      }),
    onSuccess: async function (
      _: z.output<LoanDrawdownExtensionSchemaType>,
      __: boolean,
      context: { link: ILinkInfo } | undefined,
    ) {
      clearMessages();
      setFetchKey(k => k + 1);
      navigate(context?.link?.path ?? "");
    },
  });
};
