import React from "react";
import * as Acc from "../../components";
import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import { ClaimDto, PartnerDto, ProjectDto, ProjectRole } from "@framework/types";
import { Pending } from "../../../shared/pending";
import { DateTime } from "luxon";
import { getClaimDetailsLinkType } from "@ui/components/claims/claimDetailsLink";
import { StoresConsumer } from "@ui/redux";

export interface ClaimDashboardPageParams {
  projectId: string;
  partnerId: string;
}

interface Data {
  projectDetails: Pending<ProjectDto>;
  partnerDetails: Pending<PartnerDto>;
  previousClaims: Pending<ClaimDto[]>;
  currentClaim: Pending<ClaimDto | null>;
}

class Component extends ContainerBase<ClaimDashboardPageParams, Data, {}> {

  public render() {
    const combined = Pending.combine({
      project: this.props.projectDetails,
      partner: this.props.partnerDetails,
      previousClaims: this.props.previousClaims,
      currentClaim: this.props.currentClaim,
    });

    return <Acc.PageLoader pending={combined} render={(x) => this.renderContents(x.project, x.partner, x.currentClaim, x.previousClaims)} />;
  }

  private renderContents(project: ProjectDto, partner: PartnerDto, currentClaim: ClaimDto | null, previousClaims: ClaimDto[], ) {

    return (
      <Acc.Page
        pageTitle={<Acc.Projects.Title project={project} />}
        backLink={<Acc.Projects.ProjectBackLink project={project} routes={this.props.routes} />}
        project={project}
      >
        {this.renderGuidanceMessage()}
        <Acc.Renderers.Messages messages={this.props.messages} />
        <Acc.Section qa="current-claims-section" titleContent={x => x.claimsDashboard.labels.openSectionTitle()}>
          {this.renderCurrentClaims(currentClaim ? [currentClaim] : [], "current-claims-table", project, partner, previousClaims)}
        </Acc.Section>
        <Acc.Section qa="previous-claims-section" titleContent={x => x.claimsDashboard.labels.closedSectionTitle()}>
          {this.renderPreviousClaims(previousClaims, "previous-claims-table", project, partner)}
        </Acc.Section>
      </Acc.Page>
    );
  }

  private renderGuidanceMessage() {
    return (
      <Acc.ValidationMessage
        qa="guidance-message"
        messageType="info"
        messageContent={x => x.claimsDashboard.messages.guidanceMessage()}
      />
    );
  }
  private renderNoCurrentClaimsMessage(endDate: Date, previousClaims: ClaimDto[]) {
    const date = DateTime.fromJSDate(endDate).plus({ days: 1 }).toJSDate();
    // If the final claim has been approved
    if (previousClaims && previousClaims.find(x => x.isFinalClaim)) {
      return (
        <Acc.Renderers.SimpleString qa="yourFinalClaimApprovedNotificationMessage">
          <Acc.Content value={x => x.claimsDashboard.messages.noRemainingClaims()}/>
        </Acc.Renderers.SimpleString>
      );
    }
    return (
      <Acc.Renderers.SimpleString>
        <Acc.Content value={x => x.claimsDashboard.messages.noOpenClaimsMessage(date)}/>
      </Acc.Renderers.SimpleString>
    );
  }

  private renderCurrentClaims(currentClaims: ClaimDto[], tableQa: string, project: ProjectDto, partner: PartnerDto, previousClaims: ClaimDto[]) {
    if (currentClaims.length) {
      return this.renderClaimsTable(currentClaims, tableQa, project, partner, "Open");
    }

    if (!!project.periodEndDate) {
      return this.renderNoCurrentClaimsMessage(project.periodEndDate, previousClaims);
    }

    return null;
  }

  private renderPreviousClaims(data: ClaimDto[], tableQa: string, project: ProjectDto, partner: PartnerDto) {
    if (data.length) {
      return this.renderClaimsTable(data, tableQa, project, partner, "Closed");
    }

    return <Acc.Renderers.SimpleString><Acc.Content value={x => x.claimsDashboard.messages.noClosedClaims()}/></Acc.Renderers.SimpleString>;
  }

  private renderClaimsTable(data: ClaimDto[], tableQa: string, project: ProjectDto, partner: PartnerDto, tableCaption?: string) {
    const ClaimTable = Acc.TypedTable<ClaimDto>();

    return (
      <ClaimTable.Table
        data={data}
        bodyRowFlag={x => getClaimDetailsLinkType({ claim: x, project, partner }) === "edit" ? "edit" : null}
        qa={tableQa}
        caption={tableCaption}
      >
        <ClaimTable.Custom
          headerContent={x => x.claimsDashboard.labels.period()}
          qa="period"
          value={x => <Acc.Claims.ClaimPeriodDate claim={x} />}
        />
        <ClaimTable.Currency headerContent={x => x.claimsDashboard.labels.forecastCosts()} header="Forecast costs for period" qa="forecast-cost" value={(x) => x.forecastCost} />
        <ClaimTable.Currency headerContent={x => x.claimsDashboard.labels.actualCosts()} header="Actual costs for period" qa="actual-cost" value={(x) => x.totalCost} />
        <ClaimTable.Currency headerContent={x => x.claimsDashboard.labels.difference()} header="Difference" qa="diff" value={(x) => x.forecastCost - x.totalCost} />
        <ClaimTable.Custom headerContent={x => x.claimsDashboard.labels.status()} header="Status" qa="status" value={(x) => x.statusLabel} />
        <ClaimTable.ShortDate
          header="Date of last update"
          qa="date"
          value={(x) => (x.paidDate || x.approvedDate || x.lastModifiedDate)}
        />
        <ClaimTable.Custom header="Action" hideHeader={true} qa="link" value={(x) => <Acc.Claims.ClaimDetailsLink claim={x} project={project} partner={partner} routes={this.props.routes} />} />
      </ClaimTable.Table>
    );
  }
}

const Container = (props: ClaimDashboardPageParams & BaseProps) => (
  <StoresConsumer>
    {stores => (
      <Component
        projectDetails={stores.projects.getById(props.projectId)}
        partnerDetails={stores.partners.getById(props.partnerId)}
        previousClaims={stores.claims.getInactiveClaimsForPartner(props.partnerId)}
        currentClaim={stores.claims.getActiveClaimForPartner(props.partnerId)}
        {...props}
      />
    )}
  </StoresConsumer>
);

export const ClaimsDashboardRoute = defineRoute({
  routeName: "claimsDashboard",
  routePath: "/projects/:projectId/claims/?partnerId",
  container: Container,
  getParams: (route) => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId
  }),
  accessControl: (auth, params) => {
    const isFC = auth.forPartner(params.projectId, params.partnerId).hasRole(ProjectRole.FinancialContact);
    const isMoOrPm = auth.forProject(params.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager);

    return isFC && !isMoOrPm;
  },
  getTitle: ({ content }) => content.claimsDashboard.title()
});
