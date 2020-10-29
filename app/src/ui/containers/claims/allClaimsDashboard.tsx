import { ClaimDto, PartnerDto, ProjectDto, ProjectRole, ProjectStatus } from "@framework/dtos";
import React from "react";
import { BaseProps, ContainerBase, defineRoute } from "@ui/containers/containerBase";
import * as Acc from "@ui/components";
import { Pending } from "@shared/pending";
import { DateTime } from "luxon";
import { StoresConsumer } from "@ui/redux";
import { getClaimDetailsLinkType } from "@ui/components/claims/claimDetailsLink";

export interface AllClaimsDashboardParams {
  projectId: string;
}

interface Data {
  projectDetails: Pending<ProjectDto>;
  partners: Pending<PartnerDto[]>;
  currentClaims: Pending<ClaimDto[]>;
  previousClaims: Pending<ClaimDto[]>;
}

class Component extends ContainerBase<AllClaimsDashboardParams, Data, {}> {

  render() {
    const combined = Pending.combine({
      projectDetails: this.props.projectDetails,
      partners: this.props.partners,
      currentClaims: this.props.currentClaims,
      previousClaims: this.props.previousClaims
    });

    return <Acc.PageLoader pending={combined} render={x => this.renderContents(x.projectDetails, x.partners, x.currentClaims, x.previousClaims)} />;
  }

  renderContents(projectDetails: ProjectDto, partners: PartnerDto[], currentClaims: ClaimDto[], previousClaims: ClaimDto[]) {
    return (
      <Acc.Page
        pageTitle={<Acc.Projects.Title project={projectDetails} />}
        backLink={<Acc.Projects.ProjectBackLink project={projectDetails} routes={this.props.routes} />}
        project={projectDetails}
      >
        {this.renderGuidanceMessages(projectDetails)}
        <Acc.Renderers.Messages messages={this.props.messages} />
        <Acc.Section qa="current-claims-section" titleContent={x => x.allClaimsDashboard.labels.openSectionTitle()}>
          {this.renderCurrentClaimsPerPeriod(currentClaims, projectDetails, partners)}
        </Acc.Section>
        <Acc.Section qa="closed-claims-section" titleContent={x => x.allClaimsDashboard.labels.closedSectionTitle()}>
          {this.renderPreviousClaimsSections(projectDetails, partners, previousClaims)}
        </Acc.Section>
      </Acc.Page>
    );
  }

  private renderGuidanceMessages(projectDetails: ProjectDto) {
    const isFC = projectDetails.roles & ProjectRole.FinancialContact;
    if (isFC) {
      return <Acc.ValidationMessage qa="guidance-message" messageType="info" message={x => x.allClaimsDashboard.messages.guidanceMessage()}/>;
    }

    return null;
  }

  groupClaimsByPeriod(claims: ClaimDto[]) {
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

  private renderCurrentClaimsPerPeriod(claims: ClaimDto[], project: ProjectDto, partners: PartnerDto[]) {
    const groupedClaims = this.groupClaimsByPeriod(claims);
    if (groupedClaims.length === 0) {

      if (project.status === ProjectStatus.Terminated || project.status === ProjectStatus.Closed) {
        return (
          <Acc.Renderers.SimpleString qa="theFinalClaimApprovedNotificationMessage">
            <Acc.Content value={ x => x.allClaimsDashboard.messages.noRemainingClaims()}/>
          </Acc.Renderers.SimpleString>
        );
      }

      if (!project.periodEndDate) return null;
      const date = DateTime.fromJSDate(project.periodEndDate).plus({ days: 1 }).toJSDate();
      return (
        <Acc.Renderers.SimpleString qa="notificationMessage">
          <Acc.Content value={ x => x.allClaimsDashboard.messages.noOpenClaimsMessage(date)}/>
        </Acc.Renderers.SimpleString>
      );
    }
    return groupedClaims.map((x, i) => this.renderCurrentClaims(x.periodId, x.start, x.end, x.claims, project, partners, i));
  }

  private renderCurrentClaims(periodId: number, start: Date, end: Date, claims: ClaimDto[], project: ProjectDto, partners: PartnerDto[], index: number) {
    const title = <React.Fragment>Period {periodId}: <Acc.Renderers.ShortDateRange start={start} end={end} /></React.Fragment>;
    const ClaimTable = Acc.TypedTable<ClaimDto>();
    const renderPartnerName = (x: ClaimDto) => {
      const p = partners.filter(y => y.id === x.partnerId)[0];
      if (p) return <Acc.PartnerName partner={p} showIsLead={true}/>;
      return null;
    };

    return (
      <Acc.Section title={title} qa="current-claims-section" key={index} >
        <ClaimTable.Table
          data={claims}
          bodyRowFlag={x => this.getBodyRowFlag(x, project, partners) ? "edit" : null}
          caption="Open"
          qa="current-claims-table"
        >
          <ClaimTable.Custom headerContent={x => x.allClaimsDashboard.labels.partner()} qa="partner" value={renderPartnerName} />
          <ClaimTable.Currency headerContent={x => x.allClaimsDashboard.labels.forecastCosts()} qa="forecast-cost" value={(x) => x.forecastCost} />
          <ClaimTable.Currency headerContent={x => x.allClaimsDashboard.labels.actualCosts()} qa="actual-cost" value={(x) => x.totalCost} />
          <ClaimTable.Currency headerContent={x => x.allClaimsDashboard.labels.difference()} qa="diff" value={(x) => x.forecastCost - x.totalCost} />
          <ClaimTable.String headerContent={x => x.allClaimsDashboard.labels.status()} qa="status" value={(x) => x.statusLabel} />
          <ClaimTable.ShortDate headerContent={x => x.allClaimsDashboard.labels.lastUpdated()} qa="last-update" value={x => x.paidDate || x.approvedDate || x.lastModifiedDate} />
          <ClaimTable.Custom header="Action" hideHeader={true} qa="link" value={(x) => <Acc.Claims.ClaimDetailsLink claim={x} project={project} partner={partners.find(p => p.id === x.partnerId)!} routes={this.props.routes} />} />
        </ClaimTable.Table>
      </Acc.Section>
    );
  }

  getBodyRowFlag(claim: ClaimDto, project: ProjectDto, partners: PartnerDto[]) {
    const partner = partners.find(x => x.id === claim.partnerId);
    if (!partner) return false;

    const linkType = getClaimDetailsLinkType({ claim, project, partner });
    return linkType === "edit" || linkType === "review";
  }

  private renderPreviousClaimsSections(project: ProjectDto, partners: PartnerDto[], previousClaims: ClaimDto[]) {
    const grouped = partners.map(x => ({ partner: x, claims: previousClaims.filter(y => y.partnerId === x.id) }));

    return (
      <Acc.Accordion qa="previous-claims">
        {grouped.map((x, i) => (
          <Acc.AccordionItem title={<Acc.PartnerName partner={x.partner} showIsLead={true}/>} key={i} qa={`accordion-item-${i}`}>
            {this.previousClaimsSection(project, x.partner, x.claims)}
          </Acc.AccordionItem>
        ))}
      </Acc.Accordion>
    );
  }

  private previousClaimsSection(project: ProjectDto, partner: PartnerDto, previousClaims: ClaimDto[]) {
    if (previousClaims.length === 0) {
      return (
        <Acc.Renderers.SimpleString qa={`noClosedClaims-${partner.accountId}`}><Acc.Content value={x => x.allClaimsDashboard.messages.noClosedClaims()}/></Acc.Renderers.SimpleString>
      );
    }
    const ClaimTable = Acc.TypedTable<ClaimDto>();
    return (
      <div>
        <ClaimTable.Table data={previousClaims} caption={<Acc.PartnerName partner={partner}/>} qa={`previousClaims-${partner.accountId}`}>
          <ClaimTable.Custom qa="period" value={(x) => this.renderClosedPeriodColumn(x)} />
          <ClaimTable.Currency headerContent={x => x.allClaimsDashboard.labels.forecastCosts()} qa="forecast-cost" value={(x) => x.forecastCost} />
          <ClaimTable.Currency headerContent={x => x.allClaimsDashboard.labels.actualCosts()} qa="actual-cost" value={(x) => x.totalCost} />
          <ClaimTable.Currency headerContent={x => x.allClaimsDashboard.labels.difference()} qa="diff" value={(x) => x.forecastCost - x.totalCost} />
          <ClaimTable.String headerContent={x => x.allClaimsDashboard.labels.status()} qa="status" value={(x) => x.statusLabel} />
          <ClaimTable.ShortDate headerContent={x => x.allClaimsDashboard.labels.lastUpdated()} qa="last-update" value={x => x.paidDate || x.approvedDate || x.lastModifiedDate} />
          <ClaimTable.Custom header="Action" hideHeader={true} qa="link" value={(x) => <Acc.Claims.ClaimDetailsLink claim={x} project={project} partner={partner} routes={this.props.routes} />} />
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

const Container = (props: AllClaimsDashboardParams & BaseProps) => (
  <StoresConsumer>
    {
      stores => {
        return (
          <Component
            projectDetails={stores.projects.getById(props.projectId)}
            partners={stores.partners.getPartnersForProject(props.projectId)}
            currentClaims={stores.claims.getActiveClaimsForProject(props.projectId)}
            previousClaims={stores.claims.getInactiveClaimsForProject(props.projectId)}
            {...props}
          />
        );
      }
    }
  </StoresConsumer>
);

export const AllClaimsDashboardRoute = defineRoute({
  routeName: "allClaimsDashboard",
  routePath: "/projects/:projectId/claims/dashboard",
  container: Container,
  getParams: (route) => ({
    projectId: route.params.projectId,
  }),
  getTitle: ({ content }) => content.allClaimsDashboard.title(),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager),
});
