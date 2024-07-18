import { useMemo } from "react";
import { useLazyLoadQuery } from "react-relay";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToLoanDtoArray } from "@gql/dtoMapper/mapLoanDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { claimDrawdownTableQuery } from "./ClaimDrawdownTable.query";
import { ClaimDrawdownTableQuery } from "./__generated__/ClaimDrawdownTableQuery.graphql";

export type Loan = {
  id: LoanId;
  period: number;
  status: string;
  forecastAmount: number;
  comments: string;
  requestDate: Date | null;
};

export const useClaimDrawdownTableData = (projectId: ProjectId, periodId: PeriodId) => {
  const data = useLazyLoadQuery<ClaimDrawdownTableQuery>(
    claimDrawdownTableQuery,
    { projectId, periodId },
    { fetchPolicy: "network-only" },
  );

  return useMemo(() => {
    const loanGqlData = data?.salesforce?.uiapi?.query?.Acc_Prepayment__c?.edges;

    const loan = mapToLoanDtoArray(loanGqlData ?? null, [
      "id",
      "period",
      "status",
      "forecastAmount",
      "comments",
      "requestDate",
      "amount",
      "totals",
    ]);

    return {
      loan,
      fragmentRef: data.salesforce.uiapi,
    };
  }, []);
};
