import { ContainerBase, ReduxContainer } from "../containerBase";
import * as Actions from "../../redux/actions";
import { ProjectOverviewPage } from "../../components/projectOverview";
import { Pending } from "../../../shared/pending";
import { ClaimDto, PartnerDto, ProjectDto, ProjectRole } from "../../../types/dtos";
import * as Selectors from "../../redux/selectors";
import React from "react";
import * as Acc from "../../components";
import { Accordion, AccordionItem } from "../../components";
import { ClaimStatus } from "../../../types";
import { DateTime } from "luxon";

interface Params {
  projectId: string;
}

interface Data {
  projectDetails: Pending<ProjectDto>;
  partners: Pending<PartnerDto[]>;
  currentClaims: Pending<ClaimDto[]>;
  previousClaims: Pending<ClaimDto[]>;
}

interface CombinedData {
  projectDetails: ProjectDto;
  partners: PartnerDto[];
  currentClaims: ClaimDto[];
  previousClaims: ClaimDto[];
}

interface ProjectPeriod {
  periodId: number;
  claims: ClaimDto[];
  start: Date;
  end: Date;
}

class Component extends ContainerBase<Params, Data, {}> {
  render() {
    const combined = Pending.combine(
      this.props.projectDetails,
      this.props.partners,
      this.props.currentClaims,
      this.props.previousClaims,
      (projectDetails, partners, currentClaims, previousClaims) => ({ projectDetails, partners, currentClaims, previousClaims }));
    return (<Acc.PageLoader pending={combined} render={x => this.renderContents(x)} />);
  }

  groupClaimsByPeriod(claims: ClaimDto[]): ProjectPeriod[] {
    const distinctPeriods = [...new Set(claims.map(x => x.periodId))].sort((a, b) => a - b);
    return distinctPeriods.map((period) => {
      const periodClaims = claims.filter(x => x.periodId === period);
      return {
        periodId: period,
        claims: periodClaims,
        start: periodClaims[0].periodStartDate,
        end: periodClaims[0].periodEndDate
      };
    });
  }

  renderContents({ projectDetails, partners, previousClaims, currentClaims }: CombinedData) {
    return (
      <ProjectOverviewPage project={projectDetails} partners={partners} selectedTab={AllClaimsDashboardRoute.routeName}>
        {this.renderSummary(projectDetails, partners.find(x => x.isLead)!)}
        <Acc.Section qa="current-claims-section" title="Open">
          {this.renderCurrentClaimsPerPeriod(currentClaims, projectDetails, partners)}
        </Acc.Section>
        <Acc.Section qa="closed-claims-section" title="Closed">
          {this.renderPreviousClaimsSections(projectDetails, partners, previousClaims)}
        </Acc.Section>
      </ProjectOverviewPage>
    );
  }

  private renderCurrentClaimsPerPeriod(claims: ClaimDto[], project: ProjectDto, partners: PartnerDto[]) {
    const groupedClaims = this.groupClaimsByPeriod(claims);
    if (groupedClaims.length === 0) {
      if (!project.periodEndDate) return null;
      const date = DateTime.fromJSDate(project.periodEndDate).plus({ days: 1 }).toJSDate();

      return (
        <Acc.Renderers.SimpleString qa="notificationMessage">
          There are no open claims. The next claim period begins <Acc.Renderers.FullDate value={date} />.
          </Acc.Renderers.SimpleString>
      );
    }
    return groupedClaims.map((x, i) => this.renderCurrentClaims(x, project, partners, i));
  }

  private renderLeadPartnerDetails(project: ProjectDto, partner: PartnerDto) {
    if (!partner || !(project.roles & ProjectRole.ProjectManager)) return null;
    const PartnerSummaryDetails = Acc.TypedDetails<PartnerDto>();
    return (
      <PartnerSummaryDetails.Details data={partner} title={`${partner.name} claims history`} qa="lead-partner-summary">
        <PartnerSummaryDetails.Currency label="Grant offered" qa="gol-costs" value={x => x.totalParticipantGrant} />
        <PartnerSummaryDetails.Currency label="Costs claimed" qa="claimed-costs" value={x => x.totalParticipantCostsClaimed || 0} />
        <PartnerSummaryDetails.Percentage label="Percentage claimed" qa="claimed-percentage" value={x => x.percentageParticipantCostsClaimed} />
        <PartnerSummaryDetails.Percentage label="Funding level" value={x => x.awardRate} qa="award-rate" fractionDigits={0} />
        <PartnerSummaryDetails.Percentage label="Cap limit" value={x => x.capLimit} fractionDigits={0} qa="cap-limit" />
      </PartnerSummaryDetails.Details>
    );
  }

  private renderSummary(project: ProjectDto, partner: PartnerDto) {
    const ProjectSummaryDetails = Acc.TypedDetails<ProjectDto>();

    return (
      <Acc.Section>
        <Acc.SectionPanel qa="claims-summary">
          <Acc.DualDetails>
            <ProjectSummaryDetails.Details title="Project claims history" data={project} qa="project-summary">
              <ProjectSummaryDetails.Currency label="Grant offered" qa="gol-costs" value={x => x.grantOfferLetterCosts} />
              <ProjectSummaryDetails.Currency label="Costs claimed" qa="claimed-costs" value={x => x.costsClaimedToDate || 0} />
              <ProjectSummaryDetails.Percentage label="Percentage claimed" qa="claimed-percentage" value={x => x.claimedPercentage} />
            </ProjectSummaryDetails.Details>
            { this.renderLeadPartnerDetails(project, partner) }
          </Acc.DualDetails>
        </Acc.SectionPanel>
      </Acc.Section>
    );
  }

  private claimHasNotBeenSubmittedToInnovate(x: ClaimDto) {
    return [
      ClaimStatus.INNOVATE_QUERIED,
      ClaimStatus.AWAITING_IUK_APPROVAL,
      ClaimStatus.APPROVED,
      ClaimStatus.PAID
    ].indexOf(x.status) < 0;
  }

  private renderCurrentClaims(currentInfo: ProjectPeriod, project: ProjectDto, partners: PartnerDto[], index: number) {
    const title = <React.Fragment>Period {currentInfo.periodId}: <Acc.Renderers.LongDateRange start={currentInfo.start} end={currentInfo.end} /></React.Fragment>;
    const ClaimTable = Acc.TypedTable<ClaimDto>();
    const renderPartnerName = (x: ClaimDto) => {
      const p = partners.filter(y => y.id === x.partnerId)[0];
      if (p && p.isLead) return `${p.name} (Lead)`;
      if (p) return p.name;
      return null;
    };

    const hasClaimNotYetSubmittedToInnovate = currentInfo.claims.find(this.claimHasNotBeenSubmittedToInnovate);
    const badge = hasClaimNotYetSubmittedToInnovate && <Acc.Claims.ClaimWindow periodEnd={currentInfo.end} />;

    return (
      <Acc.Section title={title} qa="current-claims-section" badge={badge} key={index}>
        <ClaimTable.Table data={currentInfo.claims} qa="current-claims-table" bodyRowFlag={(x) => x.status === ClaimStatus.SUBMITTED ? "info" : null}>
          <ClaimTable.String header="Partner" qa="partner" value={renderPartnerName} />
          <ClaimTable.Currency header="Forecast costs for period" qa="forecast-cost" value={(x) => x.forecastCost} />
          <ClaimTable.Currency header="Actual costs for period" qa="actual-cost" value={(x) => x.totalCost} />
          <ClaimTable.Currency header="Difference" qa="diff" value={(x) => x.forecastCost - x.totalCost} />
          <ClaimTable.String header="Status" qa="status" value={(x) => x.status} />
          <ClaimTable.ShortDate header="Date of last update" qa="last-update" value={x => x.paidDate || x.approvedDate || x.lastModifiedDate} />
          <ClaimTable.Custom header="" qa="link" value={(x) => <Acc.Claims.ClaimDetailsLink claim={x} project={project} partner={partners.find(p => p.id === x.partnerId)!} /> }/>
        </ClaimTable.Table>
      </Acc.Section>
    );
  }

  private renderPreviousClaimsSections(project: ProjectDto, partners: PartnerDto[], previousClaims: ClaimDto[]) {
    const grouped = partners.map(x => ({ partner: x, claims: previousClaims.filter(y => y.partnerId === x.id) }));

    return (
      <Accordion>
        {grouped.map((x, i) => (
          <AccordionItem title={`${x.partner.name} ${x.partner.isLead ? "(Lead)" : ""}`} openAltText="Hide the closed claims" closedAltText="Show the closed claims" key={i}>
            {this.previousClaimsSection(project, x.partner, x.claims)}
          </AccordionItem>
        ))}
      </Accordion>
    );
  }

  private previousClaimsSection(project: ProjectDto, partner: PartnerDto, previousClaims: ClaimDto[]) {
    if (previousClaims.length === 0) {
      return (
        <Acc.Renderers.SimpleString qa={`noClosedClaims-${partner.accountId}`}>There are no closed claims for this partner.</Acc.Renderers.SimpleString>
      );
    }
    const ClaimTable = Acc.TypedTable<ClaimDto>();
    return (
      <div>
        <ClaimTable.Table data={previousClaims} qa={`previousClaims-${partner.accountId}`}>
          <ClaimTable.Custom header="" qa="period" value={(x) => this.renderClosedPeriodColumn(x)} />
          <ClaimTable.Currency header="Forecast costs for period" qa="forecast-cost" value={(x) => x.forecastCost} />
          <ClaimTable.Currency header="Actual costs for period" qa="actual-cost" value={(x) => x.totalCost} />
          <ClaimTable.Currency header="Difference" qa="diff" value={(x) => x.forecastCost - x.totalCost} />
          <ClaimTable.String header="Status" qa="status" value={(x) => x.status} />
          <ClaimTable.ShortDate header="Date of last update" qa="last-update" value={x => x.paidDate || x.approvedDate || x.lastModifiedDate} />
          <ClaimTable.Custom header="" qa="link" value={(x) => <Acc.Claims.ClaimDetailsLink claim={x} project={project} partner={partner} />} />
        </ClaimTable.Table>
      </div>
    );
  }

  private renderClosedPeriodColumn(claim: ClaimDto) {
    return (
      <Acc.Claims.ClaimPeriodDate claim={claim} />
    );
  }
}

const definition = ReduxContainer.for<Params, Data, {}>(Component);

export const AllClaimsDashboard = definition.connect({
  withData: (state, props) => ({
    projectDetails: Selectors.getProject(props.projectId).getPending(state),
    partners: Selectors.findPartnersByProject(props.projectId).getPending(state),
    currentClaims: Selectors.getProjectCurrentClaims(state, props.projectId),
    previousClaims: Selectors.getProjectPreviousClaims(state, props.projectId)
  }),
  withCallbacks: () => ({})
});

export const AllClaimsDashboardRoute = definition.route({
  routeName: "allClaimsDashboard",
  routePath: "/projects/:projectId/claims/dashboard",
  getParams: (route) => ({
    projectId: route.params.projectId,
  }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadPartnersForProject(params.projectId),
    Actions.loadClaimsForProject(params.projectId),
  ],
  accessControl: (auth, { projectId }) => auth.for(projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager),
  container: AllClaimsDashboard
});
