import { useMemo } from "react";
import { useLazyLoadQuery } from "react-relay";
import { useContent } from "@ui/hooks";
import { getFirstEdge } from "@gql/selectors/edges";
import { financeSummaryQuery } from "./FinanceSummary.query";
import { FinanceSummaryQuery, FinanceSummaryQuery$data } from "./__generated__/FinanceSummaryQuery.graphql";
import { mapToPartnerDtoArray, mapToProjectDto } from "@gql/dtoMapper";

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

export type Project = GQL.NodeSelector<FinanceSummaryQuery$data, "Acc_Project__c">;

export type Partner = {
  id: PartnerId;
  name: string;
  totalParticipantGrant: number | null;
  totalCostsSubmitted: number | null;
  isLead: boolean;
  isWithdrawn: boolean;
  percentageParticipantCostsSubmitted: number | null;
  awardRate: number | null;
  totalGrantApproved: number | null;
  remainingParticipantGrant: number | null;
  totalPrepayment: number | null;
  capLimit: number | null;
  auditReportFrequencyName: string;
};

export const useFinanceSummaryData = (projectId: ProjectId) => {
  const data = useLazyLoadQuery<FinanceSummaryQuery>(financeSummaryQuery, {
    projectId,
  });

  const { node } = getFirstEdge<Project>(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

  const project = mapToProjectDto(node, [
    "id",
    "title",
    "periodStartDate",
    "periodEndDate",
    "periodId",
    "numberOfPeriods",
    "roles",
    "projectNumber",
  ]);

  const partners: Partner[] = mapToPartnerDtoArray(
    node?.Acc_ProjectParticipantsProject__r?.edges ?? [],
    [
      "id",
      "name",
      "isLead",
      "isWithdrawn",
      "totalParticipantGrant",
      "totalCostsSubmitted",
      "percentageParticipantCostsSubmitted",
      "awardRate",
      "totalGrantApproved",
      "remainingParticipantGrant",
      "totalPrepayment",
      "capLimit",
      "auditReportFrequencyName",
    ],
    {},
  );

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
