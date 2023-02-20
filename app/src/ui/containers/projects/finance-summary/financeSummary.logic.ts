import { useMemo } from "react";
import { useLazyLoadQuery } from "react-relay";
import { useContent } from "@ui/hooks";
import { getFirstEdge } from "@gql/selectors/edges";
import { DateConvertible } from "@framework/util";
import { financeSummaryQuery } from "./FinanceSummary.query";
import { SalesforceProjectRole } from "@framework/constants/salesforceProjectRole";
import { FinanceSummaryQuery, FinanceSummaryQuery$data } from "./__generated__/FinanceSummaryQuery.graphql";
import { sortPartners } from "@server/features/partners/sortPartners";

/**
 * calculates the percentage claimed so far
 */
function calcPercentageClaimed(total: number, claimed: number) {
  if (!total) return null;
  return (100 * (claimed || 0)) / total;
}

export const useFinanceSummaryContent = () => {
  const { getContent } = useContent();
  const content = useMemo(
    () => ({
      backToProjectOverview: getContent(x => x.pages.financeSummary.bactToProjectOverview),
      partnerFinanceDetailsTitle: getContent(x => x.pages.financeSummary.partnerFinanceDetailsTitle),
      accountantsReportTitle: getContent(x => x.pages.financeSummary.accountantsReportTitle),
      totalsFooterLabel: getContent(x => x.pages.financeSummary.totalsFooter),
      auditReportFrequencyLabel: getContent(x => x.projectLabels.auditReportFrequency),
      partnerProjectLabel: getContent(x => x.projectLabels.partner),
      projectCostsLabel: getContent(x => x.projectLabels.projectCostsLabel),
      totalEligibleCostsLabel: getContent(x => x.projectLabels.totalEligibleCostsLabel),
      totalEligibleCostsClaimedLabel: getContent(x => x.projectLabels.totalEligibleCostsClaimedLabel),
      percentageEligibleCostsClaimedLabel: getContent(x => x.projectLabels.percentageEligibleCostsClaimedLabel),
      awardRateLabel: getContent(x => x.projectLabels.awardRate),
      totalApprovedLabel: getContent(x => x.projectLabels.totalApproved),
      remainingValueLabel: getContent(x => x.projectLabels.remainingValue),
      totalPrepaymentLabel: getContent(x => x.projectLabels.totalPrepayment),
      capLimitLabel: getContent(x => x.projectLabels.capLimit),
    }),
    [],
  );

  return content;
};

export type Project = GQL.ObjectNodeSelector<FinanceSummaryQuery$data, "Acc_Project__c">;

export type Partner = {
  id: string;
  name: string;
  totalEligibleCosts: number;
  totalCostsSubmitted: number;
  isLead: boolean;
  isWithdrawn: boolean;
  percentageParticipantCostsSubmitted: number | null;
  awardRate: number | null;
  totalGrantApproved: number;
  remainingParticipantGrant: number;
  totalPrepayment: number;
  capLimit: number;
  auditReportFrequencyName: string;
};

export const useFinanceSummaryData = (projectId: string) => {
  const data = useLazyLoadQuery<FinanceSummaryQuery>(financeSummaryQuery, {
    projectId,
  });

  const { node } = getFirstEdge<Project>(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

  const project = {
    projectNumber: node?.Acc_ProjectNumber__c?.value ?? "",
    title: node?.Acc_ProjectTitle__c?.value ?? "",
    periodStartDate: (node?.Acc_CurrentPeriodStartDate__c?.value ?? "") as DateConvertible,
    periodEndDate: (node?.Acc_CurrentPeriodEndDate__c?.value ?? "") as DateConvertible,
    periodId: node?.Acc_CurrentPeriodNumber__c?.value ?? "",
    numberOfPeriods: node?.Acc_NumberofPeriods__c?.value ?? "",
    roles: node?.roles,
  };

  const partners: Partner[] =
    node?.Acc_ProjectParticipantsProject__r?.edges?.map(x => ({
      id: x?.node?.Id ?? "",
      name: x?.node?.Acc_AccountId__r?.Name?.value ?? "",
      totalEligibleCosts: x?.node?.Acc_TotalParticipantCosts__c?.value ?? 0,
      totalCostsSubmitted: x?.node?.Acc_TotalCostsSubmitted__c?.value ?? 0,
      isLead: x?.node?.Acc_ProjectRole__c?.value === SalesforceProjectRole.ProjectLead,
      isWithdrawn: ["Voluntary Withdrawal", "Involuntary Withdrawal", "Migrated - Withdrawn"].includes(
        x?.node?.Acc_ParticipantStatus__c?.value ?? "",
      ),
      percentageParticipantCostsSubmitted: calcPercentageClaimed(
        x?.node?.Acc_TotalParticipantCosts__c?.value ?? 0,
        x?.node?.Acc_TotalCostsSubmitted__c?.value ?? 0,
      ),
      awardRate: x?.node?.Acc_Award_Rate__c?.value ?? null,
      totalGrantApproved: x?.node?.Acc_TotalGrantApproved__c?.value ?? 0,
      remainingParticipantGrant: x?.node?.Acc_RemainingParticipantGrant__c?.value ?? 0,
      totalPrepayment: x?.node?.Acc_TotalPrepayment__c?.value ?? 0,
      capLimit: x?.node?.Acc_Cap_Limit__c?.value ?? 0,
      auditReportFrequencyName: x?.node?.Acc_AuditReportFrequency__c?.value ?? "",
    })) ?? [];

  const lead = partners.filter(x => x.isLead);
  const notLead = partners.filter(x => !x.isLead);

  const financeSummaryData = useMemo(
    () => ({
      project,
      partners: [...lead, ...notLead],
    }),
    [],
  );

  return financeSummaryData;
};
