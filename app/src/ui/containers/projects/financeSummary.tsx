import { getAuthRoles, ProjectRole } from "@framework/types";
import { PartnerDto, ProjectDto } from "@framework/dtos";
import { roundCurrency } from "@framework/util";
import { Pending } from "@shared/pending";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { useStores } from "@ui/redux";
import { useContent } from "@ui/hooks";

import * as ACC from "@ui/components";

interface Data {
  project: Pending<ProjectDto>;
  partners: Pending<PartnerDto[]>;
  content: {
    backToProjectOverview: string;
    partnerFinanceDetailsTitle: string;
    accountantsReportTitle: string;
    totalsFooterLabel: string;
    partnerProjectLabel: string;
    projectCostsLabel: string;
    totalEligibleCostsLabel: string;
    totalEligibleCostsClaimedLabel: string;
    percentageEligibleCostsClaimedLabel: string;
    awardRateLabel: string;
    totalApprovedLabel: string;
    remainingValueLabel: string;
    totalPrepaymentLabel: string;
    capLimitLabel: string;
    auditReportFrequencyLabel: string;
  };
}

interface Params {
  projectId: string;
  partnerId: string;
}

class FinanceSummaryComponent extends ContainerBase<Params, Data> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      partners: this.props.partners,
    });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.partners)} />;
  }

  private renderContents(project: ProjectDto, partners: PartnerDto[]) {
    const { content, partnerId, routes } = this.props;

    const { isPmOrMo } = getAuthRoles(project.roles);

    const FinanceSummaryTable = ACC.TypedTable<PartnerDto>();
    const partnersToShow = isPmOrMo ? partners : partners.filter(x => x.id === partnerId);
    const footerTotalValues = isPmOrMo ? this.renderTotalValueFooters(partners) : [];

    const backLink = (
      <ACC.BackLink route={routes.projectOverview.getLink({ projectId: this.props.projectId })}>
        {content.backToProjectOverview}
      </ACC.BackLink>
    );

    const currentPeriodTitle = (
      <ACC.Content
        value={x => x.financeSummary.projectMessages.currentPeriodInfo(project.periodId, project.numberOfPeriods)}
      />
    );

    return (
      <ACC.Page backLink={backLink} pageTitle={<ACC.Projects.Title {...project} />} project={project}>
        <ACC.Section
          title={currentPeriodTitle}
          subtitle={<ACC.Renderers.ShortDateRange start={project.periodStartDate} end={project.periodEndDate} />}
          qa="financeSummarySection"
        >
          <ACC.Section title={content.projectCostsLabel}>
            <FinanceSummaryTable.Table data={partnersToShow} qa="ProjectCostsToDate" footers={footerTotalValues}>
              <FinanceSummaryTable.Custom
                hideHeader
                qa="Partner"
                header={content.partnerProjectLabel}
                value={x => <ACC.PartnerName partner={x} showIsLead />}
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

            <ACC.Section title={content.partnerFinanceDetailsTitle}>
              <FinanceSummaryTable.Table data={partnersToShow} qa="PartnerFinanceDetails">
                <FinanceSummaryTable.Custom
                  hideHeader
                  qa="Partner"
                  value={x => ACC.getPartnerName(x, true)}
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
              </FinanceSummaryTable.Table>

              <ACC.Section title={content.accountantsReportTitle}>
                <FinanceSummaryTable.Table qa="WhenAnIarIsNeeded" data={partnersToShow}>
                  <FinanceSummaryTable.Custom
                    qa="Partner"
                    hideHeader
                    header={content.partnerProjectLabel}
                    value={x => ACC.getPartnerName(x, true)}
                  />

                  <FinanceSummaryTable.String
                    qa="Frequency"
                    header={content.auditReportFrequencyLabel}
                    hideHeader
                    value={x => x.auditReportFrequencyName}
                  />
                </FinanceSummaryTable.Table>
              </ACC.Section>
            </ACC.Section>
          </ACC.Section>
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderTotalValueFooters(partners: PartnerDto[]) {
    const totalParticipantGrantTotal = partners.reduce<number>(
      (val, partner) => roundCurrency(val + (partner.totalParticipantGrant || 0)),
      0,
    );
    const totalCostsSubmittedTotal = partners.reduce<number>(
      (val, partner) => roundCurrency(val + (partner.totalCostsSubmitted || 0)),
      0,
    );

    const percentageParticipantCostsSubmittedTotal = totalParticipantGrantTotal
      ? (100 * (totalCostsSubmittedTotal || 0)) / totalParticipantGrantTotal
      : null;

    const footerColumns = [
      // eslint-disable-next-line react/jsx-key
      <ACC.Renderers.Currency value={totalParticipantGrantTotal} />,
      // eslint-disable-next-line react/jsx-key
      <ACC.Renderers.Currency value={totalCostsSubmittedTotal} />,
      // eslint-disable-next-line react/jsx-key
      <ACC.Renderers.Percentage value={percentageParticipantCostsSubmittedTotal} />,
    ].map((x, i) => (
      <td key={i} className="govuk-table__cell govuk-table__cell--numeric acc-table__cell-top-border">
        {x}
      </td>
    ));

    return [
      <tr key={1}>
        <th key="th" className="govuk-table__cell acc-table__cell-top-border">
          {this.props.content.totalsFooterLabel}
        </th>

        {...footerColumns}
      </tr>,
    ];
  }
}

function FinanceSummaryContainer(props: Params & BaseProps) {
  const stores = useStores();
  const { getContent } = useContent();

  const financeSummaryContent = {
    backToProjectOverview: getContent(x => x.financeSummary.backToProjectOverview),
    partnerFinanceDetailsTitle: getContent(x => x.financeSummary.partnerFinanceDetailsTitle),
    accountantsReportTitle: getContent(x => x.financeSummary.accountantsReportTitle),
    totalsFooterLabel: getContent(x => x.financeSummary.totalsFooterLabel),
    auditReportFrequencyLabel: getContent(x => x.financeSummary.projectLabels.auditReportFrequency),
    partnerProjectLabel: getContent(x => x.financeSummary.projectLabels.partner),
    projectCostsLabel: getContent(x => x.financeSummary.projectLabels.projectCosts),
    totalEligibleCostsLabel: getContent(x => x.financeSummary.projectLabels.totalEligibleCosts),
    totalEligibleCostsClaimedLabel: getContent(x => x.financeSummary.projectLabels.totalEligibleCostsClaimed),
    percentageEligibleCostsClaimedLabel: getContent(x => x.financeSummary.projectLabels.percentageEligibleCostsClaimed),
    awardRateLabel: getContent(x => x.financeSummary.projectLabels.awardRate),
    totalApprovedLabel: getContent(x => x.financeSummary.projectLabels.totalApproved),
    remainingValueLabel: getContent(x => x.financeSummary.projectLabels.remainingValue),
    totalPrepaymentLabel: getContent(x => x.financeSummary.projectLabels.totalPrepayment),
    capLimitLabel: getContent(x => x.financeSummary.projectLabels.capLimit),
  };

  return (
    <FinanceSummaryComponent
      {...props}
      content={financeSummaryContent}
      project={stores.projects.getById(props.projectId)}
      partners={stores.partners.getPartnersForProject(props.projectId)}
    />
  );
}

export const FinanceSummaryRoute = defineRoute({
  routeName: "FinanceSummary",
  routePath: "/projects/:projectId/finance-summary/:partnerId",
  container: FinanceSummaryContainer,
  getParams: x => ({
    projectId: x.params.projectId,
    partnerId: x.params.partnerId,
  }),
  accessControl: (auth, params) =>
    auth
      .forProject(params.projectId)
      .hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer, ProjectRole.FinancialContact),
  getTitle: x => x.content.financeSummary.title(),
});
