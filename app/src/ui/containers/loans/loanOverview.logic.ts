import { useMemo } from "react";
import { useLazyLoadQuery } from "react-relay";
import { getFirstEdge } from "@gql/selectors/edges";
import { loanOverviewQuery } from "./LoanOverview.query";
import { LoanOverviewQuery } from "./__generated__/LoanOverviewQuery.graphql";
import { mapToLoanDtoArray, mapToProjectDto } from "@gql/dtoMapper";

export type Loan = {
  id: LoanId;
  period: number;
  status: string;
  forecastAmount: number;
  comments: string;
  requestDate: Date | null;
};

export const useLoanOverviewData = (projectId: ProjectId) => {
  const data = useLazyLoadQuery<LoanOverviewQuery>(loanOverviewQuery, { projectId }, { fetchPolicy: "network-only" });

  return useMemo(() => {
    const projectGqlData = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
    const loanGqlData = data?.salesforce?.uiapi?.query?.Acc_Prepayment__c?.edges;

    const project = mapToProjectDto(projectGqlData?.node, ["id", "title", "projectNumber", "roles"]);

    const loans = mapToLoanDtoArray(loanGqlData ?? null, [
      "id",
      "period",
      "status",
      "forecastAmount",
      "comments",
      "requestDate",
    ]);

    return {
      project,
      loans,
    };
  }, []);
};
