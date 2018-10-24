import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { Pending } from "../../../shared/pending";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { ProjectOverviewPage } from "../../components/projectOverview";
import { ClaimDto, PartnerDto, ProjectDto } from "../../models";
import { DualDetails, Link, Section, SectionPanel, TypedDetails, TypedLoader, TypedTable } from "../../components";
import { DayAndLongMonth, FullDate, LongYear, ShortDate, ShortMonth } from "../../components/renderers";
import { PrepareClaimRoute } from "./prepare";
import { ClaimsDetailsRoute } from "./details";
import { SimpleString } from "../../components/renderers";
import { ReviewClaimRoute } from "./review";

interface Params {
  projectId: string;
  partnerId: string;
}

interface Data {
  projectDetails: Pending<ProjectDto>;
  partnerDetails: Pending<PartnerDto>;
  claims: Pending<ClaimDto[]>;
}

interface CombinedData {
  projectDetails: ProjectDto;
  partnerDetails: PartnerDto;
  claims: ClaimDto[];
}

class Component extends ContainerBase<Params, Data, {}> {
  public render() {
    const combined = Pending.combine(
      this.props.projectDetails,
      this.props.partnerDetails,
      this.props.claims,
      (projectDetails, partnerDetails, claims) => ({ projectDetails, partnerDetails, claims })
    );

    const Loader = TypedLoader<CombinedData>();
    return <Loader pending={combined} render={(x) => this.renderContents(x.projectDetails, x.partnerDetails, x.claims)} />;
  }

  private renderContents(project: ProjectDto, partner: PartnerDto, claims: ClaimDto[]) {
    const currentClaim = claims.find(claim => !claim.approvedDate);
    const previousClaims = currentClaim ? claims.filter(claim => claim.id !== currentClaim.id) : claims;
    const Details = TypedDetails<PartnerDto>();
    const currentClaimsSectionTitle = (
      currentClaim && <React.Fragment>Claim for P{currentClaim.periodId} - <DayAndLongMonth value={currentClaim.periodStartDate} /> to <FullDate value={currentClaim.periodEndDate} /></React.Fragment>
    );

    return (
      <ProjectOverviewPage selectedTab={ClaimsDashboardRoute.routeName} project={project} partnerId={partner.id} partners={[partner]}>
        <Section>
          <SectionPanel qa="claims-dashboard" title="Project claims history">
            <DualDetails displayDensity="Compact">
              <Details.Details qa="claims-history-col-0" data={partner}>
                <Details.Currency label="Grant offer letter costs" value={x => x.totalParticipantGrant} />
                <Details.Currency label="Costs claimed to date" value={x => x.totalParticipantCostsClaimed} />
                <Details.Percentage label="Percentage claimed to date" value={x => x.percentageParticipantCostsClaimed} />
              </Details.Details>
              <Details.Details qa="claims-history-col-1" data={partner}>
                <Details.Percentage label="Award offer rate" value={x => x.awardRate} fractionDigits={0} />
                <Details.Percentage label="Cap limit" value={x => x.capLimit} fractionDigits={0} />
              </Details.Details>
            </DualDetails>
          </SectionPanel>
        </Section>
        <Section qa="current-claim-summary-table-section" title={currentClaimsSectionTitle}>
          {this.renderClaims(currentClaim ? [currentClaim] : [], "current-claim-summary-table", project.id, true)}
        </Section>
        <Section qa="" title="Previous claims">
          {this.renderClaims(previousClaims, "previous-claims-summary-table", project.id, false)}
        </Section>
      </ProjectOverviewPage>
    );
  }

  private getLink(claim: ClaimDto, projectId: string) {
    if (claim.status === "New" || claim.status === "Draft") {
      return <Link route={PrepareClaimRoute.getLink({ projectId, partnerId: claim.partnerId, periodId: claim.periodId })}>Edit claim</Link>;
    }
    if (claim.status === "Submitted" || claim.status === "MO Queried" || claim.status === "Awaiting IUK Approval") {
      return <Link route={ReviewClaimRoute.getLink({ projectId, partnerId: claim.partnerId, periodId: claim.periodId })}>Review claim</Link>;
    }
    return <Link route={ClaimsDetailsRoute.getLink({ projectId, partnerId: claim.partnerId, periodId: claim.periodId })}>View claim</Link>;
  }

  private renderClaims(data: ClaimDto[], tableQa: string, projectId: string, isCurrentClaim: boolean) {
    const ClaimTable = TypedTable<ClaimDto>();

    if (isCurrentClaim && !data.length) {
      return <SimpleString>The next open claim period will be...</SimpleString>;
    }

    if (!isCurrentClaim && !data.length) {
      return <SimpleString>You do not have any previous claims for this project</SimpleString>;
    }

    return (
      <ClaimTable.Table qa={tableQa} data={data}>
        <ClaimTable.Custom
          header="Period"
          qa="period"
          value={(x) => (
            <span>P{x.periodId}<br />
              <ShortMonth value={x.periodStartDate} /> to <ShortMonth value={x.periodEndDate} /> <LongYear value={x.periodEndDate} />
            </span>)}
        />
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
              <ShortDate value={(x.paidDate || x.approvedDate || x.lastModifiedDate)} />
            </span>)}
        />
        <ClaimTable.Custom header="" qa="link" value={(x) => this.getLink(x, projectId)} />
      </ClaimTable.Table>
    );
  }
}

const definition = ReduxContainer.for<Params, Data, {}>(Component);

export const ClaimsDashboard = definition.connect({
  withData: (state, params) => ({
    projectDetails: Selectors.getProject(params.projectId).getPending(state),
    partnerDetails: Selectors.getPartner(params.partnerId).getPending(state),
    claims: Selectors.findClaimsByPartner(params.partnerId).getPending(state)
  }),
  withCallbacks: () => ({})
});

export const ClaimsDashboardRoute = definition.route({
  routeName: "claimDashboard",
  routePath: "/projects/:projectId/claims/?partnerId",
  getParams: (route) => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId
  }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadPartner(params.partnerId),
    Actions.loadClaimsForPartner(params.partnerId)
  ],
  container: ClaimsDashboard
});
