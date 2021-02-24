import * as ACC from "@ui/components";
import { PartnerDto, ProjectDto, ProjectRole } from "@framework/dtos";
import { Pending } from "@shared/pending";
import { TypedTable } from "@ui/components";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import { StoresConsumer } from "@ui/redux";

interface Data {
  project: Pending<ProjectDto>;
  partners: Pending<PartnerDto[]>;
}

interface Params {
  projectId: string;
  partnerId: string;
}

interface Callbacks {

}

class FinanceSummaryComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      partners: this.props.partners
    });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.partners)} />;
  }

  private renderContents(project: ProjectDto, partners: PartnerDto[]) {
    const backLinkTitle = <ACC.Content value={x => x.financeSummary.backToProjectOverview}/>;

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={this.props.routes.projectOverview.getLink({ projectId: this.props.projectId })}>{backLinkTitle}</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title {...project} />}
        project={project}
      >
        <ACC.Section
          title={<ACC.Content value={x => x.financeSummary.projectMessages.currentPeriodInfo(project.periodId, project.numberOfPeriods)} />}
          subtitle={<ACC.Renderers.ShortDateRange start={project.periodStartDate} end={project.periodEndDate} />}
          qa="financeSummarySection"
        >
          {this.renderFinanceSummary(project, partners)}
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderFinanceSummary(project: ProjectDto, partners: PartnerDto[]) {
    const FinanceSummaryTable = TypedTable<PartnerDto>();
    const partnersToShow =
      (project.roles & ProjectRole.ProjectManager || project.roles & ProjectRole.MonitoringOfficer)
        ? partners
        : partners.filter(x => x.id === this.props.partnerId);

    const costToDateTitle = <ACC.Content value={x => x.financeSummary.projectLabels.projectCosts}/>;
    const partnerFinanceDetailsTitle = <ACC.Content value={x => x.financeSummary.partnerFinanceDetailsTitle}/>;
    const accountantsReportTitle = <ACC.Content value={x => x.financeSummary.accountantsReportTitle}/>;

    return (
      <>
        <ACC.Section title={costToDateTitle}>
          <FinanceSummaryTable.Table data={partnersToShow} qa="ProjectCostsToDate" footers={this.renderTotalValueFooters(project, partners)}>
            <FinanceSummaryTable.Custom headerContent={x => x.financeSummary.projectLabels.partner} hideHeader qa="Partner" value={x => <ACC.PartnerName partner={x} showIsLead />} />
            <FinanceSummaryTable.Currency headerContent={x => x.financeSummary.projectLabels.totalEligibleCosts} qa="TotalEligibleCosts" value={x => x.totalParticipantGrant} />
            <FinanceSummaryTable.Currency headerContent={x => x.financeSummary.projectLabels.totalEligibleCostsClaimed} qa="CostsClaimedToDate" value={x => x.totalCostsSubmitted} />
            <FinanceSummaryTable.Percentage headerContent={x => x.financeSummary.projectLabels.percentageEligibleCostsClaimed} qa="PercentageOfCostsClaimedToDate" value={x => x.percentageParticipantCostsSubmitted} />
          </FinanceSummaryTable.Table>
          <ACC.Section title={partnerFinanceDetailsTitle}>
            <FinanceSummaryTable.Table data={partnersToShow} qa="PartnerFinanceDetails">
              <FinanceSummaryTable.Custom headerContent={x => x.financeSummary.projectLabels.partner} hideHeader qa="Partner" value={x => <ACC.PartnerName partner={x} showIsLead />} />
              <FinanceSummaryTable.Currency headerContent={x => x.financeSummary.projectLabels.totalEligibleCosts} qa="TotalEligibleCosts" value={x => x.totalParticipantGrant} />
              <FinanceSummaryTable.Percentage headerContent={x => x.financeSummary.projectLabels.awardRate} qa="FundingLevel" value={x => x.awardRate} />
              <FinanceSummaryTable.Currency headerContent={x => x.financeSummary.projectLabels.totalGrant} qa="TotalGrant" value={x => x.totalGrantApproved} />
              <FinanceSummaryTable.Currency headerContent={x => x.financeSummary.projectLabels.remainingGrant} qa="RemainingGrant" value={x => x.remainingParticipantGrant} />
              <FinanceSummaryTable.Currency headerContent={x => x.financeSummary.projectLabels.totalPrepayment} qa="TotalGrantPaidInAdvance" value={x => x.totalPrepayment} />
              <FinanceSummaryTable.Percentage headerContent={x => x.financeSummary.projectLabels.capLimit} qa="ClaimCap" value={x => x.capLimit} />
            </FinanceSummaryTable.Table>
            <ACC.Section title={accountantsReportTitle}>
              <FinanceSummaryTable.Table data={partnersToShow} qa="WhenAnIarIsNeeded" >
                <FinanceSummaryTable.Custom headerContent={x => x.financeSummary.projectLabels.partner} hideHeader value={x => <ACC.PartnerName partner={x} showIsLead />} qa="Partner" />
                <FinanceSummaryTable.String headerContent={x => x.financeSummary.projectLabels.auditReportFrequency} hideHeader value={x => x.auditReportFrequencyName} qa="Frequency" />
              </FinanceSummaryTable.Table>
            </ACC.Section>
          </ACC.Section>
        </ACC.Section>
      </>
    );
  }

  private renderTotalValueFooters(project: ProjectDto, partners: PartnerDto[]) {
    if (project.roles & ProjectRole.ProjectManager || project.roles & ProjectRole.MonitoringOfficer) {
      const totalParticipantGrantTotal = partners.reduce((val, partner) => {
        return val + (partner.totalParticipantGrant || 0);
      }, 0);

      const totalCostsSubmittedTotal = partners.reduce((val, partner) => {
        return val + (partner.totalCostsSubmitted || 0);
      }, 0);

      const percentageParticipantCostsSubmittedTotal = (totalParticipantGrantTotal) ? 100 * (totalCostsSubmittedTotal || 0) / totalParticipantGrantTotal : null;
      return [(
        <tr key={1}>
          <th key="th" className="govuk-table__cell acc-table__cell-top-border">
            <ACC.Content value={x => x.financeSummary.totalsFooterLabel} />
          </th>
          {this.renderTableFooter(<ACC.Renderers.Currency value={totalParticipantGrantTotal} />, 1)}
          {this.renderTableFooter(<ACC.Renderers.Currency value={totalCostsSubmittedTotal} />, 2)}
          {this.renderTableFooter(<ACC.Renderers.Percentage value={percentageParticipantCostsSubmittedTotal} />, 3)}
        </tr>
      )];
    } else {
      return [];
    }
  }

  private renderTableFooter(child: React.ReactElement<any>, key: number) {
    return (
      <td key={key} className="govuk-table__cell govuk-table__cell--numeric acc-table__cell-top-border">
        {child}
      </td>
    );
  }
}

const FinanceSummaryContainer = (props: Params & BaseProps) => (
  <StoresConsumer>
    {stores => (
      <FinanceSummaryComponent
        project={stores.projects.getById(props.projectId)}
        partners={stores.partners.getPartnersForProject(props.projectId)}
        {...props}
      />
    )}
  </StoresConsumer>
);

export const FinanceSummaryRoute = defineRoute({
  routeName: "FinanceSummary",
  routePath: "/projects/:projectId/finance-summary/:partnerId",
  container: FinanceSummaryContainer,
  getParams: (route) => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId
  }),
  accessControl: (auth, params) => auth.forProject(params.projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer, ProjectRole.FinancialContact),
  getTitle: ({ content }) => content.financeSummary.title()
});
