import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { Pending } from "../../../shared/pending";
import * as Actions from "../../redux/actions/index";
import { ProjectOverviewPage } from "../../components/projectOverview";
import { ClaimDto, PartnerDto, ProjectDto } from "../../models";
import { Details, DualDetails, Link, Section, SectionPanel, Table, TypedLoader } from "../../components";
import { DayAndLongMonth, FullDate, LongYear, ShortMonth } from "../../components/renderers";
import { PrepareClaimRoute } from "./prepare";
import { ClaimsDetailsRoute } from "./details";

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

  private renderContents = (project: ProjectDto, partner: PartnerDto, claims: ClaimDto[]) => {
    const currentClaim = claims.find(claim => !claim.approvedDate);
    const previousClaims = currentClaim ? claims.filter(claim => claim.id !== currentClaim.id) : claims;
    return (
      <ProjectOverviewPage selectedTab={ClaimsDashboardRoute.routeName} project={project} partnerId={partner.id} partners={[partner]}>
        <ProjectClaimsHistory partner={partner} />
        <CurrentClaimSummary claim={currentClaim} projectId={project.id} />
        <PastClaimsSummary claims={previousClaims} projectId={project.id} />
      </ProjectOverviewPage>
    );
  }
}

interface ClaimsHistoryProps {
  partner: PartnerDto;
}

const ProjectClaimsHistory: React.SFC<ClaimsHistoryProps> = ({ partner }) => {
  const { Details: Column, Currency, Percentage } = Details.forData(partner);
  return (
    <Section>
      <SectionPanel title="Project claims history">
        <DualDetails displayDensity="Compact">
          <Column qa="claims-history-col-0">
            <Currency label="Grant offer letter costs" value={x => x.totalParticipantGrant} />
            <Currency label="Costs claimed to date" value={x => x.totalParticipantCostsClaimed} />
            <Percentage label="Percentage claimed to date" value={x => x.percentageParticipantCostsClaimed} />
          </Column>
          <Column qa="claims-history-col-1">
            <Percentage label="Award offer rate" value={x => x.awardRate} />
            <Percentage label="Cap limit" value={x => x.capLimit} />
          </Column>
        </DualDetails>
      </SectionPanel>
    </Section>
  );
};

interface CurrentClaimSummaryProps {
  claim?: ClaimDto;
  projectId: string;
}

const CurrentClaimSummary: React.SFC<CurrentClaimSummaryProps> = ({ claim, projectId }) => {
  if (!claim) {
    return (
      <Section title="...">
        <p className="govuk-body">The next open claim period will be...</p>
      </Section>);
  }

  const sectionTitle = (
    <React.Fragment>Claim for {claim.periodId} - <DayAndLongMonth value={claim.periodStartDate} /> to <FullDate value={claim.periodEndDate} /></React.Fragment>
  );
  const ClaimTable = Table.forData([claim]);
  return (
    <Section title={sectionTitle}>
      <ClaimTable.Table qa="current-claim-summary-table">
        <ClaimTable.Currency header="Forecast costs for period" qa="forecast-cost" value={(x) => x.forecastCost} />
        <ClaimTable.Currency header="Actual costs for period" qa="actual-cost" value={(x) => x.totalCost} />
        <ClaimTable.Currency header="Difference" qa="diff" value={(x) => x.forecastCost - x.totalCost} />
        <ClaimTable.String header="Status" qa="status" value={(x) => x.status} />
        <ClaimTable.ShortDate header="Date of last update" qa="last-update" value={(x) => x.lastModifiedDate} />
        <ClaimTable.Custom
          header=""
          qa="link"
          value={(x) => (<Link route={PrepareClaimRoute.getLink({ projectId, claimId: x.id })}>Edit claim</Link>)}
        />
      </ClaimTable.Table>
    </Section>
  );
};

interface PastClaimsSummaryProps {
  claims: ClaimDto[];
  projectId: string;
}

const PastClaimsSummary: React.SFC<PastClaimsSummaryProps> = ({ claims, projectId }) => {
  if (claims.length === 0) {
    return (
      <Section title="Previous Claims">
        <p className="govuk-body">You do not have any previous claims for this project</p>
      </Section>);
  }
  const ClaimTable = Table.forData(claims);
  return (
    <Section title="Previous Claims">
      <ClaimTable.Table qa="previous-claims-summary-table">
        <ClaimTable.Custom
          header="Period"
          qa="period"
          value={(x) => (
            <span>{x.periodId}<br />
              <ShortMonth value={x.periodStartDate} /> to <ShortMonth value={x.periodEndDate} /> <LongYear value={x.periodEndDate} />
            </span>)}
        />
        <ClaimTable.Currency header="Forecast costs for period" qa="forecast-cost" value={(x) => x.forecastCost} />
        <ClaimTable.Currency header="Actual costs for period" qa="actual-cost" value={(x) => x.totalCost} />
        <ClaimTable.Currency header="Difference" qa="diff" value={(x) => x.forecastCost - x.totalCost} />
        <ClaimTable.Custom
          header="Status and date"
          qa="status"
          value={(x) => (
            <span>
              Claim {x.status}
              <br />
              <FullDate value={(x.paidDate || x.approvedDate || x.lastModifiedDate)} />
            </span>)}
        />
        <ClaimTable.Custom
          header=""
          qa="link"
          value={(x) => (<Link route={ClaimsDetailsRoute.getLink({ projectId, claimId: x.id })}>View claim</Link>)}
        />
      </ClaimTable.Table>
    </Section>
  );
};
const definition = ReduxContainer.for<Params, Data, {}>(Component);

export const ClaimsDashboard = definition.connect({
  withData: (state, params) => ({
    projectDetails: Pending.create(state.data.project[params.projectId]),
    partnerDetails: Pending.create(state.data.partner[params.partnerId]),
    claims: Pending.create(state.data.claims[params.partnerId])
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
