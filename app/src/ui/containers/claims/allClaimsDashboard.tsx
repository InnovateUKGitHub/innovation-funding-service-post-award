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
}

class Component extends ContainerBase<Params, Data, {}> {
  render() {
    const combined = Pending.combine(this.props.projectDetails, this.props.partners, this.props.claims, (projectDetails, partners, claims) => ({ projectDetails, partners, claims }));

    const Loader = Acc.TypedLoader<{ projectDetails: ProjectDto, partners: PartnerDto[], claims: ClaimDto[] }>();

    return (<Loader pending={combined} render={x => this.renderContents(x)} />);
  }

  renderContents({ projectDetails, partners, claims }: { projectDetails: ProjectDto, partners: PartnerDto[], claims: ClaimDto[] }) {
    const currentPeriodId = claims.reduce((x, y) => y.periodId > x ? y.periodId : x, 0);
    const currentPeriodInfo = claims.filter(x => x.periodId === currentPeriodId)
      .map(x => ({ periodId: currentPeriodId, start: x.periodStartDate, end: x.periodEndDate }))[0];

    const currentClaims = claims.filter(x => x.periodId === currentPeriodId);
    // todo: not yet in scope willl be needed by following ticket
    // const remainingClaims = claims.filter(x => x.periodId < currentPeriodId);

    return (
      <ProjectOverviewPage project={projectDetails} partners={partners} selectedTab={AllClaimsDashboardRoute.routeName}>
        {this.renderCurrentClaims(currentPeriodInfo, projectDetails, partners, currentClaims)}
        {/* {this.renderPreviousClaimsSections(projectDetails, partners, remainingClaims)} */}
      </ProjectOverviewPage>
    );
  }

  private renderCurrentClaims(currentInfo: { periodId: number, start: Date, end: Date }, project: ProjectDto, partners: PartnerDto[], claims: ClaimDto[]) {
    const title = <React.Fragment>Claim for P{currentInfo.periodId} - <Acc.Renderers.LongDateRange {...currentInfo} /></React.Fragment>;
    const ClaimTable = Acc.TypedTable<ClaimDto>();

    return (
      <Acc.Section title={title} qa="current-claims-section">
        <ClaimTable.Table data={claims} qa="current-claims-table" bodyRowFlag={(x) => x.status === ClaimStatus.SUBMITTED ? "info" : null }>
          <ClaimTable.String
            header="Partner"
            qa="partner"
            value={x => {
              const p = partners.filter(y => y.id === x.partnerId)[0];
              if (p && p.isLead) {
                return `${p.name} (Lead)`;
              }
              if (p) {
                return p.name;
              }
              return null;
            }}
          />
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
          <ClaimTable.Custom header="" qa="link" value={(x) => this.getLink(x, project.id)} />
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
          <ClaimTable.Custom header="" qa="link" value={(x) => this.getLink(x, project.id)} />
        </ClaimTable.Table>
      </div>
    );
  }

  private renderPeriodColumn({ periodId, periodStartDate, periodEndDate }: ClaimDto) {
    return (
      <span>P{periodId} <Acc.Renderers.DateRange start={periodStartDate} end={periodEndDate} /></span>
    );
  }

  private getLink(claim: ClaimDto, projectId: string) {
    const reviewStatus = [ClaimStatus.SUBMITTED, ClaimStatus.AWAITING_IAR, ClaimStatus.AWAITING_IUK_APPROVAL];
    if (reviewStatus.indexOf(claim.status) >= 0) {
      return <Acc.Link route={ReviewClaimRoute.getLink({ projectId, partnerId: claim.partnerId, periodId: claim.periodId })}>Review claim</Acc.Link>;
    }
    return <Acc.Link route={ClaimsDetailsRoute.getLink({ projectId, partnerId: claim.partnerId, periodId: claim.periodId })}>View claim</Acc.Link>;
  }
}

const definition = ReduxContainer.for<Params, Data, {}>(Component);

export const AllClaimsDashboard = definition.connect({
  withData: (state, params) => ({
    projectDetails: Selectors.getProject(params.projectId).getPending(state),
    partners: Selectors.findPartnersByProject(params.projectId).getPending(state),
    claims: Selectors.findClaimsByProject(params.projectId).getPending(state)
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
