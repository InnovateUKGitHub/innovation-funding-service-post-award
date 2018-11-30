import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { ProjectOverviewPage } from "../../components/projectOverview";
import { Pending } from "../../../shared/pending";
import { ClaimDto, ProjectDto } from "../../../types/dtos";
import * as Selectors from "../../redux/selectors";
import * as Actions from "../../redux/actions";
import * as Acc from "../../components";
import { ClaimsDetailsRoute, ReviewClaimRoute, } from ".";
import { ClaimStatus } from "../../../types";

interface Params {
  projectId: string;
}

interface Data {
  projectDetails: Pending<ProjectDto>;
  partners: Pending<PartnerDto[]>;
  claims: Pending<ClaimDto[]>;
  currentClaims: Pending<ClaimDto[]>;
  previousClaims: Pending<ClaimDto[]>;
}

interface CombinedData {
  projectDetails: ProjectDto;
  partners: PartnerDto[];
  claims: ClaimDto[];
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
      this.props.claims,
      this.props.currentClaims,
      this.props.previousClaims,
      (projectDetails, partners, claims, currentClaims, previousClaims) => ({ projectDetails, partners, claims, currentClaims, previousClaims }));

    const Loader = Acc.TypedLoader<CombinedData>();

    return (<Loader pending={combined} render={x => this.renderContents(x)} />);
  }

  groupClaimsByPeriod(claims: ClaimDto[]): ProjectPeriod[] {
    const distinctPeriods = [...new Set(claims.map(x => x.periodId))].sort((a, b) => a-b);
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

  renderContents({ projectDetails, partners, claims, previousClaims, currentClaims }: CombinedData) {
    return (
      <ProjectOverviewPage project={projectDetails} partners={partners} selectedTab={AllClaimsDashboardRoute.routeName}>
        {this.renderSummary(projectDetails)}
        <Acc.Section title="Open">
          {this.renderCurrentClaimsPerPeriod(currentClaims, projectDetails, partners)}
        </Acc.Section>
        {/* {this.renderPreviousClaimsSections(projectDetails, partners, remainingClaims)} */}
      </ProjectOverviewPage>
    );
  }

  private renderCurrentClaimsPerPeriod(claims: ClaimDto[], project: ProjectDto, partners: PartnerDto[]) {
    const groupedClaims = this.groupClaimsByPeriod(claims);
    return groupedClaims.map(x => this.renderCurrentClaims(x, project, partners));
  }

  private renderSummary(project: ProjectDto) {
    const SummaryDetails = Acc.TypedDetails<ProjectDto>();

    return (
      <Acc.Section>
        <Acc.SectionPanel qa="claims-summary" title="History">
          <SummaryDetails.Details data={project} qa="project_summary-col-0">
            <SummaryDetails.Currency label="Grant offered" qa="gol-costs" value={x => x.grantOfferLetterCosts}/>
            <SummaryDetails.Currency label="Costs claimed" qa="claimed-costs" value={x => x.costsClaimedToDate}/>
            <SummaryDetails.Percentage label="Percentage claimed" qa="claimed-percentage" value={x => x.claimedPercentage}/>
          </SummaryDetails.Details>
        </Acc.SectionPanel>
      </Acc.Section>
    );
  }

  private renderCurrentClaims(currentInfo: ProjectPeriod, project: ProjectDto, partners: PartnerDto[]) {
    const title = <React.Fragment>Period {currentInfo.periodId} - <Acc.Renderers.LongDateRange start={currentInfo.start} end={currentInfo.end} /></React.Fragment>;
    const ClaimTable = Acc.TypedTable<ClaimDto>();
    const renderPartnerName = (x: ClaimDto) => {
      const p = partners.filter(y => y.id === x.partnerId)[0];
      if (p && p.isLead) return `${p.name} (Lead)`;
      if (p) return p.name;
      return null;
    };

    return (
      <Acc.Section title={title} qa="current-claims-section" badge={<Acc.Claims.ClaimWindow periodEnd={currentInfo.end}/>}>
        <ClaimTable.Table data={currentInfo.claims} qa="current-claims-table" bodyRowFlag={(x) => x.status === ClaimStatus.SUBMITTED ? "info" : null }>
          <ClaimTable.String header="Partner" qa="partner" value={renderPartnerName}/>
          <ClaimTable.Currency header="Forecast costs for period" qa="forecast-cost" value={(x) => x.forecastCost} />
          <ClaimTable.Currency header="Actual costs for period" qa="actual-cost" value={(x) => x.totalCost} />
          <ClaimTable.Currency header="Difference" qa="diff" value={(x) => x.forecastCost - x.totalCost} />
          <ClaimTable.Custom
            header="Status"
            qa="status"
            value={(x) => (
              <span>
                {x.status}
                <br />
                <Acc.Renderers.ShortDate value={(x.paidDate || x.approvedDate || x.lastModifiedDate)} />
              </span>)}
          />
          <ClaimTable.Custom header="" qa="link" value={(x) => this.getReviewLink(x, project.id)} />
        </ClaimTable.Table>
      </Acc.Section>
    );
  }

  private renderPreviousClaimsSections(project: ProjectDto, partners: PartnerDto[], previousClaims: ClaimDto[]) {
    const grouped = partners
      .map(x => ({ partner: x, claims: previousClaims.filter(y => y.partnerId === x.id) }))
      .filter(x => x.claims.length);

    if (!grouped.length) {
      return null;
    }

    return (
      <Acc.Section title="Previous claims">
        {grouped.map(x => this.previousClaimsSection(project, x.partner, x.claims))}
      </Acc.Section>
    );
  }

  private previousClaimsSection(project: ProjectDto, partner: PartnerDto, previousClaims: ClaimDto[]) {
    const ClaimTable = Acc.TypedTable<ClaimDto>();
    return (
      <div>
        <h4>{partner.name}</h4>
        <ClaimTable.Table data={previousClaims} qa={`previousClaims-${partner.accountId}`}>
          <ClaimTable.Custom header="Period" qa="period" value={(x) => this.renderPeriodColumn(x)} />
          <ClaimTable.Currency header="Forecast costs for period" qa="forecast-cost" value={(x) => x.forecastCost} />
          <ClaimTable.Currency header="Actual costs for period" qa="actual-cost" value={(x) => x.totalCost} />
          <ClaimTable.Currency header="Difference" qa="diff" value={(x) => x.forecastCost - x.totalCost} />
          <ClaimTable.Custom
            header="Status"
            qa="status"
            value={(x) => (
              <span>
                {x.status}
                <br />
                <Acc.Renderers.ShortDate value={(x.paidDate || x.approvedDate || x.lastModifiedDate)} />
              </span>)}
          />
          <ClaimTable.Custom header="" qa="link" value={(x) => this.getViewLink(x, project.id)} />
        </ClaimTable.Table>
      </div>
    );
  }

  private renderPeriodColumn({ periodId, periodStartDate, periodEndDate }: ClaimDto) {
    return (
      <span>P{periodId} <Acc.Renderers.DateRange start={periodStartDate} end={periodEndDate} /></span>
    );
  }

  private getReviewLink(claim: ClaimDto, projectId: string) {
    if (claim.status === ClaimStatus.SUBMITTED) {
      return <Acc.Link route={ReviewClaimRoute.getLink({ projectId, partnerId: claim.partnerId, periodId: claim.periodId })}>Review claim</Acc.Link>;
    }
    const draftStatus = [ClaimStatus.DRAFT, ClaimStatus.REVIEWING_FORECASTS];
    if (draftStatus.indexOf(claim.status) >= 0) {
      return this.getViewLink(claim, projectId);
    }
    return null;
  }

  private getViewLink(claim: ClaimDto, projectId: string) {
    return <Acc.Link route={ClaimsDetailsRoute.getLink({ projectId, partnerId: claim.partnerId, periodId: claim.periodId })}>View claim</Acc.Link>;
  }
}

const definition = ReduxContainer.for<Params, Data, {}>(Component);

export const AllClaimsDashboard = definition.connect({
  withData: (state, props) => ({
    projectDetails: Selectors.getProject(props.projectId).getPending(state),
    partners: Selectors.findPartnersByProject(props.projectId).getPending(state),
    claims: Selectors.findClaimsByProject(props.projectId).getPending(state),
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
  container: AllClaimsDashboard
});
