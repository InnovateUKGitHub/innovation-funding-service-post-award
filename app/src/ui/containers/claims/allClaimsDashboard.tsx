import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { ProjectOverviewPage } from "../../components/projectOverview";
import { Pending } from "../../../shared/pending";
import { ClaimDto, ProjectDto } from "../../../types/dtos";
import * as Selectors from "../../redux/selectors";
import * as Actions from "../../redux/actions";
import * as Acc from "../../components";
import { Accordion, AccordionItem } from "../../components";
import { ClaimsDetailsRoute, ReviewClaimRoute, } from ".";
import { ClaimStatus } from "../../../types";
import {DateTime} from "luxon";

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

  renderContents({ projectDetails, partners, previousClaims, currentClaims }: CombinedData) {
    return (
      <ProjectOverviewPage project={projectDetails} partners={partners} selectedTab={AllClaimsDashboardRoute.routeName}>
        {this.renderSummary(projectDetails)}
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
        if(!project.periodEndDate) return null;
        const date = DateTime.fromJSDate(project.periodEndDate).plus({days: 1}).toJSDate();

        return (
          <Acc.Renderers.SimpleString qa="notificationMessage">
            There are no open claims. The next claim period begins <Acc.Renderers.FullDate value={date} />.
          </Acc.Renderers.SimpleString>
        );
    }
    return groupedClaims.map(x => this.renderCurrentClaims(x, project, partners));
  }

  private renderSummary(project: ProjectDto) {
    const SummaryDetails = Acc.TypedDetails<ProjectDto>();

    return (
      <Acc.Section>
        <Acc.SectionPanel qa="claims-summary" title="History">
          <Acc.DualDetails>
            <SummaryDetails.Details data={project} qa="project_summary-col-0">
              <SummaryDetails.Currency label="Grant offered" qa="gol-costs" value={x => x.grantOfferLetterCosts}/>
              <SummaryDetails.Currency label="Costs claimed" qa="claimed-costs" value={x => x.costsClaimedToDate}/>
              <SummaryDetails.Percentage label="Percentage claimed" qa="claimed-percentage" value={x => x.claimedPercentage}/>
            </SummaryDetails.Details>
          </Acc.DualDetails>
        </Acc.SectionPanel>
      </Acc.Section>
    );
  }

  private claimHasNotBeenSubmittedToInnovate(x: ClaimDto) {
    return [
      ClaimStatus.INNOVATE_QUERIED,
      ClaimStatus.REVIEWING_FORECASTS_FOLLOWING_INNOVATE_QUERY,
      ClaimStatus.AWAITING_IUK_APPROVAL,
      ClaimStatus.APPROVED,
      ClaimStatus.PAID
    ].indexOf(x.status) < 0;
  }

  private renderCurrentClaims(currentInfo: ProjectPeriod, project: ProjectDto, partners: PartnerDto[]) {
    const title = <React.Fragment>Period {currentInfo.periodId}: <Acc.Renderers.LongDateRange start={currentInfo.start} end={currentInfo.end} /></React.Fragment>;
    const ClaimTable = Acc.TypedTable<ClaimDto>();
    const renderPartnerName = (x: ClaimDto) => {
      const p = partners.filter(y => y.id === x.partnerId)[0];
      if (p && p.isLead) return `${p.name} (Lead)`;
      if (p) return p.name;
      return null;
    };

    const hasClaimNotYetSubmittedToInnovate = currentInfo.claims.find(this.claimHasNotBeenSubmittedToInnovate);
    const badge = hasClaimNotYetSubmittedToInnovate && <Acc.Claims.ClaimWindow periodEnd={currentInfo.end}/>;

    return (
      <Acc.Section title={title} qa="current-claims-section" badge={badge}>
        <ClaimTable.Table data={currentInfo.claims} qa="current-claims-table" bodyRowFlag={(x) => x.status === ClaimStatus.SUBMITTED ? "info" : null }>
          <ClaimTable.String header="Partner" qa="partner" value={renderPartnerName}/>
          <ClaimTable.Currency header="Forecast costs for period" qa="forecast-cost" value={(x) => x.forecastCost} />
          <ClaimTable.Currency header="Actual costs for period" qa="actual-cost" value={(x) => x.totalCost} />
          <ClaimTable.Currency header="Difference" qa="diff" value={(x) => x.forecastCost - x.totalCost} />
          <ClaimTable.String header="Status" qa="status" value={(x) => x.status}/>
          <ClaimTable.ShortDate header="Date of last update" qa="last-update" value={x => x.paidDate || x.approvedDate || x.lastModifiedDate}/>
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
      return <Acc.Renderers.SimpleString>There are no closed claims for this partner.</Acc.Renderers.SimpleString>;
    }

    return (
        <Accordion>
          {grouped.map(x => (
            <AccordionItem title={`${x.partner.name} ${x.partner.isLead ? "(Lead)" : ""}`} openAltText="Hide the closed claims" closedAltText="Show the closed claims">
              {this.previousClaimsSection(project, x.partner, x.claims)}
            </AccordionItem>
          ))}
        </Accordion>
    );
  }

  private previousClaimsSection(project: ProjectDto, partner: PartnerDto, previousClaims: ClaimDto[]) {
    const ClaimTable = Acc.TypedTable<ClaimDto>();
    return (
      <div>
        <ClaimTable.Table data={previousClaims} qa={`previousClaims-${partner.accountId}`}>
          <ClaimTable.Custom header="" qa="period" value={(x) => this.renderClosedPeriodColumn(x)} />
          <ClaimTable.Currency header="Forecast costs for period" qa="forecast-cost" value={(x) => x.forecastCost} />
          <ClaimTable.Currency header="Actual costs for period" qa="actual-cost" value={(x) => x.totalCost} />
          <ClaimTable.Currency header="Difference" qa="diff" value={(x) => x.forecastCost - x.totalCost} />
          <ClaimTable.String header="Status" qa="status" value={(x) => x.status}/>
          <ClaimTable.ShortDate header="Date of last update" qa="last-update" value={x => x.paidDate || x.approvedDate || x.lastModifiedDate}/>
          <ClaimTable.Custom header="" qa="link" value={(x) => this.getLink(x, project.id)} />
        </ClaimTable.Table>
      </div>
    );
  }

  private renderClosedPeriodColumn(claim: ClaimDto) {
    return (
      <Acc.Claims.ClaimPeriodDate claim={claim} />
    );
  }
  private getLink(claim: ClaimDto, projectId: string) {
    switch (claim.status) {
      case ClaimStatus.DRAFT:
      case ClaimStatus.REVIEWING_FORECASTS:
        return null;
      case ClaimStatus.SUBMITTED:
        return <Acc.Link route={ReviewClaimRoute.getLink({projectId, partnerId: claim.partnerId, periodId: claim.periodId})}>Review claim</Acc.Link>;
      default:
        return <Acc.Link route={ClaimsDetailsRoute.getLink({projectId, partnerId: claim.partnerId, periodId: claim.periodId})}>View claim</Acc.Link>;
    }
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
  container: AllClaimsDashboard
});
