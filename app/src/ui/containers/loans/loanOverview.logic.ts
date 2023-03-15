import { useMemo } from "react";
import { useLazyLoadQuery } from "react-relay";
import { getFirstEdge } from "@gql/selectors/edges";
import { loanOverviewQuery } from "./LoanOverview.query";
import { LoanOverviewQuery } from "./__generated__/LoanOverviewQuery.graphql";
import { mapToLoanDtoArray, mapToProjectDto } from "@gql/dtoMapper";

export type Loan = {
  id: string;
  period: number;
  status: string;
  forecastAmount: number;
  comments: string;
  requestDate: Date | null;
};

export const useLoanOverviewData = (projectId: string) => {
  const data = useLazyLoadQuery<LoanOverviewQuery>(loanOverviewQuery, { projectId });

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
