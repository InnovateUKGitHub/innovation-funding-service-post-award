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
        value={x =>
          x.projectMessages.currentPeriodInfo({
            currentPeriod: project.periodId,
            numberOfPeriods: project.numberOfPeriods,
          })
        }
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
                value={x => ACC.getPartnerName(x, true)}
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
      <ACC.Renderers.Currency key={0} value={totalParticipantGrantTotal} />,
      <ACC.Renderers.Currency key={1} value={totalCostsSubmittedTotal} />,
      <ACC.Renderers.Percentage key={2} value={percentageParticipantCostsSubmittedTotal} />,
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

        {footerColumns}
      </tr>,
    ];
  }
}

const FinanceSummaryContainer = (props: Params & BaseProps) => {
  const stores = useStores();
  const { getContent } = useContent();

  const financeSummaryContent = {
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
  };

  return (
    <FinanceSummaryComponent
      {...props}
      content={financeSummaryContent}
      project={stores.projects.getById(props.projectId)}
      partners={stores.partners.getPartnersForProject(props.projectId)}
    />
  );
};

export const FinanceSummaryRoute = defineRoute({
  allowRouteInActiveAccess: true,
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
  getTitle: x => x.content.getTitleCopy(x => x.pages.financeSummary.title),
});
