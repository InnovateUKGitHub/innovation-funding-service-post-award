import { BaseProps, defineRoute } from "@ui/app/containerBase";
import { useFinanceSummaryContent, useFinanceSummaryData } from "./financeSummary.logic";
import type { Partner } from "./financeSummary.logic";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { roundCurrency } from "@framework/util/numberHelper";
import { Content } from "@ui/components/molecules/Content/content";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { Section } from "@ui/components/molecules/Section/section";
import { BackLink } from "@ui/components/atoms/Links/links";
import { getPartnerName } from "@ui/components/organisms/partners/utils/partnerName";
import { Currency } from "@ui/components/atoms/Currency/currency";
import { ShortDateRange } from "@ui/components/atoms/Date";
import { Percentage } from "@ui/components/atoms/Percentage/percentage";
import { createTypedTable } from "@ui/components/molecules/Table/Table";

type Props = {
  projectId: ProjectId;
  partnerId: PartnerId;
};

const FinanceSummaryPage = (props: Props & BaseProps) => {
  const content = useFinanceSummaryContent();
  const FinanceSummaryTable = createTypedTable<Partner>();
  const { project, partners, fragmentRef } = useFinanceSummaryData(props.projectId);

  const isPmOrMo = project.roles?.isPm || project.roles?.isMo;

  const partnersToShow = isPmOrMo ? partners : partners?.filter(x => x.id === props.partnerId);
  const footerTotalValues = isPmOrMo ? renderTotalValueFooters(partners, content.totalsFooterLabel) : [];

  return (
    <Page
      backLink={
        <BackLink route={props.routes.projectOverview.getLink({ projectId: props.projectId })}>
          {content.backToProjectOverview}
        </BackLink>
      }
      partnerId={props.partnerId}
      fragmentRef={fragmentRef}
    >
      <Section
        title={
          <Content
            value={x =>
              x.projectMessages.currentPeriodInfo({
                currentPeriod: project.periodId,
                numberOfPeriods: project.numberOfPeriods,
              })
            }
          />
        }
        subtitle={<ShortDateRange start={project.periodStartDate} end={project.periodEndDate} />}
        qa="financeSummarySection"
      >
        <Section title={content.projectCostsLabel}>
          <FinanceSummaryTable.Table
            caption={content.projectCostsLabel}
            data={partnersToShow}
            qa="ProjectCostsToDate"
            footers={footerTotalValues}
          >
            <FinanceSummaryTable.Custom
              hideHeader
              qa="Partner"
              header={content.partnerProjectLabel}
              value={x => getPartnerName(x, true)}
            />

            <FinanceSummaryTable.Currency
              qa="TotalEligibleCosts"
              header={content.totalEligibleCostsLabel}
              value={x => x.totalParticipantGrant}
            />

            <FinanceSummaryTable.Currency
              qa="CostsClaimedToDate"
              header={content.totalEligibleCostsClaimedLabel}
              value={x => x.totalCostsSubmitted}
            />

            <FinanceSummaryTable.Percentage
              qa="PercentageOfCostsClaimedToDate"
              header={content.percentageEligibleCostsClaimedLabel}
              value={x => x.percentageParticipantCostsSubmitted}
            />
          </FinanceSummaryTable.Table>
        </Section>

        <Section title={content.partnerFinanceDetailsTitle}>
          <FinanceSummaryTable.Table
            caption={content.partnerFinanceDetailsTitle}
            data={partnersToShow}
            qa="PartnerFinanceDetails"
          >
            <FinanceSummaryTable.Custom
              hideHeader
              qa="Partner"
              value={x => getPartnerName(x, true)}
              header={content.partnerProjectLabel}
            />

            <FinanceSummaryTable.Currency
              qa="TotalEligibleCosts"
              header={content.totalEligibleCostsLabel}
              value={x => x.totalParticipantGrant}
            />

            <FinanceSummaryTable.Percentage
              qa="FundingLevel"
              header={content.awardRateLabel}
              value={x => x.awardRate}
            />

            <FinanceSummaryTable.Currency
              qa="TotalGrant"
              header={content.totalApprovedLabel}
              value={x => x.totalGrantApproved}
            />

            <FinanceSummaryTable.Currency
              qa="RemainingGrant"
              header={content.remainingValueLabel}
              value={x => x.remainingParticipantGrant}
            />

            <FinanceSummaryTable.Currency
              qa="TotalGrantPaidInAdvance"
              header={content.totalPrepaymentLabel}
              value={x => x.totalPrepayment}
            />

            <FinanceSummaryTable.Percentage qa="ClaimCap" header={content.capLimitLabel} value={x => x.capLimit} />

            <FinanceSummaryTable.Currency
              qa="capLimitDeferredGrant"
              header={content.capLimitDeferredGrantLabel}
              value={x => x.capLimitDeferredGrant}
            />
          </FinanceSummaryTable.Table>
        </Section>
        <Section title={content.accountantsReportTitle}>
          <FinanceSummaryTable.Table
            caption={content.accountantsReportTitle}
            qa="WhenAnIarIsNeeded"
            data={partnersToShow}
          >
            <FinanceSummaryTable.Custom
              qa="Partner"
              hideHeader
              header={content.partnerProjectLabel}
              value={x => getPartnerName(x, true)}
            />

            <FinanceSummaryTable.String
              qa="Frequency"
              header={content.auditReportFrequencyLabel}
              hideHeader
              value={x => x.auditReportFrequencyName}
            />
          </FinanceSummaryTable.Table>
        </Section>
      </Section>
    </Page>
  );
};

const renderTotalValueFooters = (
  partners: Pick<Partner, "totalParticipantGrant" | "totalCostsSubmitted">[],
  totalsFooterLabel: string,
) => {
  const totalEligibleCostsTotal = partners.reduce<number>(
    (val, partner) => roundCurrency(val + (partner.totalParticipantGrant || 0)),
    0,
  );
  const totalCostsSubmittedTotal = partners.reduce<number>(
    (val, partner) => roundCurrency(val + (partner.totalCostsSubmitted || 0)),
    0,
  );

  const percentageParticipantCostsSubmittedTotal = totalEligibleCostsTotal
    ? (100 * (totalCostsSubmittedTotal || 0)) / totalEligibleCostsTotal
    : null;

  const footerColumns = [
    <Currency key={0} value={totalEligibleCostsTotal} />,
    <Currency key={1} value={totalCostsSubmittedTotal} />,
    <Percentage key={2} value={percentageParticipantCostsSubmittedTotal} />,
  ].map((x, i) => (
    <td key={i} className="govuk-table__cell govuk-table__cell--numeric acc-table__cell-top-border">
      {x}
    </td>
  ));

  return [
    <tr key={1}>
      <th key="th" className="govuk-table__cell acc-table__cell-top-border">
        {totalsFooterLabel}
      </th>

      {footerColumns}
    </tr>,
  ];
};

export const FinanceSummaryRoute = defineRoute({
  allowRouteInActiveAccess: true,
  routeName: "financeSummary",
  routePath: "/projects/:projectId/finance-summary/:partnerId",
  container: FinanceSummaryPage,
  getParams: x => ({
    projectId: x.params.projectId as ProjectId,
    partnerId: x.params.partnerId as PartnerId,
  }),
  accessControl: (auth, params) =>
    auth
      .forProject(params.projectId)
      .hasAnyRoles(
        ProjectRolePermissionBits.ProjectManager,
        ProjectRolePermissionBits.MonitoringOfficer,
        ProjectRolePermissionBits.FinancialContact,
      ),
  getTitle: x => x.content.getTitleCopy(x => x.pages.financeSummary.title),
});
