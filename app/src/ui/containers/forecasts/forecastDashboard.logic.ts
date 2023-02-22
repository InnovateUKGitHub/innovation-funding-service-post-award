import { useMemo } from "react";
import { useLazyLoadQuery } from "react-relay";
import { getFirstEdge } from "@gql/selectors/edges";
import { getProjectStatus } from "@framework/util/projectStatus";
import { SalesforceProjectRole } from "@framework/constants/salesforceProjectRole";
import { forecastDashboardQuery } from "./ForecastDashboard.query";
import { ForecastDashboardQuery, ForecastDashboardQuery$data } from "./__generated__/ForecastDashboardQuery.graphql";

export type Partner = {
  id: string;
  name: string;
  isLead: boolean;
  isWithdrawn: boolean;
  forecastLastModifiedDate: string;
  forecastsAndCosts: number;
  totalParticipantCosts: number;
};
type ProjectGQL = GQL.ObjectNodeSelector<ForecastDashboardQuery$data, "Acc_Project__c">;

export const useForecastDashboardData = (projectId: string) => {
  const data = useLazyLoadQuery<ForecastDashboardQuery>(forecastDashboardQuery, { projectId });
  const projectGqlData = getFirstEdge<ProjectGQL>(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

  return useMemo(() => {
    const project = {
      id: projectGqlData?.node?.Id ?? "",
      title: projectGqlData?.node?.Acc_ProjectTitle__c?.value ?? "",
      projectNumber: projectGqlData?.node?.Acc_ProjectNumber__c?.value ?? "",
      roles: projectGqlData?.node?.roles ?? { isMo: false, isPm: false, isFc: false },
      status: getProjectStatus(projectGqlData?.node?.Acc_ProjectStatus__c?.value ?? ""),
    };

    const partners: Partner[] =
      projectGqlData?.node?.Acc_ProjectParticipantsProject__r?.edges?.map(x => ({
        id: x?.node?.Id ?? "",
        name: x?.node?.Acc_AccountId__r?.Name?.value ?? "",
        isLead: x?.node?.Acc_ProjectRole__c?.value === SalesforceProjectRole.ProjectLead,
        isWithdrawn: ["Voluntary Withdrawal", "Involuntary Withdrawal", "Migrated - Withdrawn"].includes(
          x?.node?.Acc_ParticipantStatus__c?.value ?? "",
        ),
        totalParticipantCosts: x?.node?.Acc_TotalParticipantCosts__c?.value ?? 0,
        forecastLastModifiedDate: x?.node?.Acc_ForecastLastModifiedDate__c?.value ?? "",
        forecastsAndCosts:
          (x?.node?.Acc_TotalFutureForecastsForParticipant__c?.value ?? 0) +
          (x?.node?.Acc_TotalApprovedCosts__c?.value ?? 0),
      })) ?? [];

    const lead = partners.filter(x => x.isLead);
    const notLead = partners.filter(x => !x.isLead);

    return { project, partners: [...lead, ...notLead] };
  }, []);
};
