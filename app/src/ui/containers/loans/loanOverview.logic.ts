import { useMemo } from "react";
import { useLazyLoadQuery } from "react-relay";
import { LoanStatus } from "@framework/entities";
import { Clock } from "@framework/util";
import { getFirstEdge } from "@gql/selectors/edges";
import { loanOverviewQuery } from "./LoanOverview.query";
import { LoanOverviewQuery, LoanOverviewQuery$data } from "./__generated__/LoanOverviewQuery.graphql";

const loanStatusFromSfMap = (fieldValue: string): LoanStatus => {
  const loanFromSfStatusMap = {
    Planned: LoanStatus.PLANNED,
    Requested: LoanStatus.REQUESTED,
    Approved: LoanStatus.APPROVED,
  };
  const statusValueMatch = loanFromSfStatusMap[fieldValue as keyof typeof loanFromSfStatusMap];

  return statusValueMatch || LoanStatus.UNKNOWN;
};

const clock = new Clock();

type Project = GQL.ObjectNodeSelector<LoanOverviewQuery$data, "Acc_Project__c">;

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
    const projectGqlData = getFirstEdge<Project>(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
    const loanGqlData = data?.salesforce?.uiapi?.query?.Acc_Prepayment__c?.edges;

    const project = {
      id: projectGqlData?.node?.Id ?? "",
      title: projectGqlData?.node?.Acc_ProjectTitle__c?.value ?? "",
      projectNumber: projectGqlData?.node?.Acc_ProjectNumber__c?.value ?? "",
      roles: projectGqlData?.node?.roles ?? ({ isMo: false, isPm: false, isFc: false } as const),
    };

    const loans: Loan[] =
      loanGqlData?.map(x => ({
        id: x?.node?.Id ?? "",
        period: x?.node?.Acc_PeriodNumber__c?.value ?? 0,
        status: loanStatusFromSfMap(x?.node?.Loan_DrawdownStatus__c?.value ?? ""),
        forecastAmount: x?.node?.Loan_LatestForecastDrawdown__c?.value ?? 0,
        comments: x?.node?.Loan_UserComments__c?.value ?? "",
        requestDate: clock.parseOptionalSalesforceDateTime(x?.node?.Loan_PlannedDateForDrawdown__c?.value ?? ""),
      })) ?? [];

    return {
      project,
      loans,
    };
  }, []);
};
