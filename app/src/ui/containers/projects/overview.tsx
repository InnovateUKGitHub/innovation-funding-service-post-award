import React from "react";

import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import * as Dtos from "@framework/dtos";
import { Pending } from "@shared/pending";
import { IClientUser, PartnerClaimStatus, PartnerDto, ProjectDto, ProjectRole, ProjectStatus } from "@framework/types";
import * as ACC from "@ui/components";
import { IClientConfig } from "@ui/redux/reducers/configReducer";
import { StoresConsumer } from "@ui/redux";
import { IRoutes } from "@ui/routing";
import { PartnerName } from "@ui/components";
import { Content } from "@content/content";

interface Data {
  projectDetails: Pending<Dtos.ProjectDto>;
  partners: Pending<Dtos.PartnerDto[]>;
  user: IClientUser;
  config: IClientConfig;
}

interface Params {
  projectId: string;
}

class ProjectOverviewComponent extends ContainerBase<Params, Data, {}> {
  render() {
    const combined = Pending.combine({
      project: this.props.projectDetails,
      partners: this.props.partners,
    });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.partners)} />;
  }

  private isPartnerWithdrawn(project: Dtos.ProjectDto, partners: Dtos.PartnerDto[]) {
    if (project.roles & ProjectRole.ProjectManager) {
      const leadPartner = partners.find(x => x.isLead);
      return leadPartner && leadPartner.isWithdrawn;
    }
    return partners.some(p => !!(p.roles & ProjectRole.FinancialContact) && p.isWithdrawn);
  }

  private renderContents(project: Dtos.ProjectDto, partners: Dtos.PartnerDto[]) {
    // find first partner with role
    const partner = partners.filter(x => x.roles !== ProjectRole.Unknown)[0];

    const isProjectClosed = project.status === ProjectStatus.Closed || project.status === ProjectStatus.Terminated;

    const title = isProjectClosed || project.isPastEndDate || this.isPartnerWithdrawn(project, partners)
      ? <ACC.Content value={x => x.projectOverview.messages.projectEnded()}/>
      : <ACC.Content value={x => x.projectOverview.messages.currentPeriodInfo(project.periodId, project.totalPeriods!)}/>;

    const subtitle = isProjectClosed ? null :
      project.isPastEndDate || this.isPartnerWithdrawn(project, partners)
        ? <ACC.Content value={x => x.projectOverview.messages.finalClaimPeriod()}/>
        : <ACC.Renderers.ShortDateRange start={project.periodStartDate} end={project.periodEndDate} />;

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={this.props.routes.projectDashboard.getLink({})}>Back to projects</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
      >
        <ACC.Section
          qa="period-information"
          className="govuk-!-padding-bottom-6"
          title={title}
          subtitle={subtitle}
        >
          {this.renderProjectOverviewDetails(project, partner)}
        </ACC.Section>
        {this.renderLinks(project, partner || partners[0], this.props.routes)}
      </ACC.Page>
    );
  }

  private renderProjectOverviewDetails(project: ProjectDto, partner: PartnerDto) {
    if ((project.roles & ProjectRole.ProjectManager) && partner) {
      return this.renderPMOverviewDetails(project, partner);
    }

    if ((project.roles & ProjectRole.FinancialContact) && partner) {
      return this.renderFCOverviewDetails(partner);
    }

    return null;
  }

  private renderFCOverviewDetails(partner: PartnerDto) {
    const PartnerSummaryDetails = ACC.TypedDetails<PartnerDto>();

    return (
      <ACC.SectionPanel qa="claims-totals" title={<React.Fragment><PartnerName partner={partner} /> costs to date</React.Fragment>}>
        <ACC.DualDetails displayDensity="Compact">
          <PartnerSummaryDetails.Details qa="claims-totals-col-0" data={partner}>
            <PartnerSummaryDetails.Currency label={<ACC.Content value={x => x.projectOverview.labels.totalEligibleCosts()}/>} qa="gol-costs" value={x => x.totalParticipantGrant} />
            <PartnerSummaryDetails.Currency label={<ACC.Content value={x => x.projectOverview.labels.totalEligibleCostsClaimed()}/>} qa="claimed-costs" value={x => x.totalParticipantCostsClaimed || 0} />
            <PartnerSummaryDetails.Percentage label={<ACC.Content value={x => x.projectOverview.labels.percentageEligibleCostsClaimed()}/>} qa="percentage-costs" value={x => x.percentageParticipantCostsClaimed} />
          </PartnerSummaryDetails.Details>
        </ACC.DualDetails>
      </ACC.SectionPanel>
    );
  }

  private renderPMOverviewDetails(project: ProjectDto, partner: PartnerDto) {
    const ProjectSummaryDetails = ACC.TypedDetails<ProjectDto>();
    const PartnerSummaryDetails = ACC.TypedDetails<PartnerDto>();
    return (
      <ACC.SectionPanel qa="claims-summary">
        <ACC.DualDetails>
          <ProjectSummaryDetails.Details title={<ACC.Content value={x => x.projectOverview.labels.projectCosts()}/>} data={project} qa="project-summary">
            <ProjectSummaryDetails.Currency label={<ACC.Content value={x => x.projectOverview.labels.totalEligibleCosts()}/>} qa="gol-costs" value={x => x.grantOfferLetterCosts} />
            <ProjectSummaryDetails.Currency label={<ACC.Content value={x => x.projectOverview.labels.totalEligibleCostsClaimed()}/>} qa="claimed-costs" value={x => x.costsClaimedToDate || 0} />
            <ProjectSummaryDetails.Percentage label={<ACC.Content value={x => x.projectOverview.labels.percentageEligibleCostsClaimed()}/>} qa="claimed-percentage" value={x => x.claimedPercentage} />
          </ProjectSummaryDetails.Details>
          <PartnerSummaryDetails.Details data={partner} title={<React.Fragment><ACC.PartnerName partner={partner} /> costs to date</React.Fragment>} qa="lead-partner-summary">
            <PartnerSummaryDetails.Currency label={<ACC.Content value={x => x.projectOverview.labels.totalEligibleCosts()}/>} qa="gol-costs" value={x => x.totalParticipantGrant} />
            <PartnerSummaryDetails.Currency label={<ACC.Content value={x => x.projectOverview.labels.totalEligibleCostsClaimed()}/>} qa="claimed-costs" value={x => x.totalParticipantCostsClaimed || 0} />
            <PartnerSummaryDetails.Percentage label={<ACC.Content value={x => x.projectOverview.labels.percentageEligibleCostsClaimed()}/>} qa="claimed-percentage" value={x => x.percentageParticipantCostsClaimed} />
          </PartnerSummaryDetails.Details>
        </ACC.DualDetails>
      </ACC.SectionPanel>
    );
  }

  private renderLinks(project: ProjectDto, partner: PartnerDto, routes: IRoutes) {
    const projectId = project.id;
    const projectRole = project.roles;
    const partnerId = partner.id;

    let links = [
      { textContent: (x: Content) => x.projectOverview.links.claims(), link: routes.allClaimsDashboard.getLink({ projectId }), messages: () => this.getClaimMessages(project, partner) },
      { textContent: (x: Content) => x.projectOverview.links.claims(), link: routes.claimsDashboard.getLink({ projectId, partnerId }), messages: () => this.getClaimMessages(project, partner) },
      { textContent: (x: Content) => x.projectOverview.links.monitoringReport(), link: routes.monitoringReportDashboard.getLink({ projectId }) },
      { textContent: (x: Content) => x.projectOverview.links.forecast(), link: routes.forecastDashboard.getLink({ projectId }) },
      { textContent: (x: Content) => x.projectOverview.links.forecasts(), link: routes.forecastDetails.getLink({ projectId, partnerId }) },
      { textContent: (x: Content) => x.projectOverview.links.projectChangeRequests(), link: routes.projectChangeRequests.getLink({ projectId }), messages: () => this.getPcrMessages(project) },
      { textContent: (x: Content) => x.projectOverview.links.projectChangeRequests(), link: routes.pcrsDashboard.getLink({ projectId }), messages: () => this.getPcrMessages(project) },
      { textContent: (x: Content) => x.projectOverview.links.documents(), link: routes.projectDocuments.getLink({ projectId }) },
      { textContent: (x: Content) => x.projectOverview.links.details(), link: routes.projectDetails.getLink({ id: projectId }) },
      { textContent: (x: Content) => x.projectOverview.links.summary(), link: routes.financeSummary.getLink({ projectId, partnerId }) },
    ];

    // filter out links the current user doesn't have access to
    links = links.filter(x => x.link.accessControl(this.props.user, this.props.config));

    // special case if not fc shouldn't have link to ViewForecastRoute from this page... the view forecast route has permission from the project forecasts route
    if (projectRole & (ProjectRole.MonitoringOfficer | ProjectRole.ProjectManager)) {
      links = links.filter(x => x.link.routeName !== routes.forecastDetails.routeName);
    }

    return (
      <ACC.NavigationCardsGrid>
        {links.map((x, i) =>
          <ACC.NavigationCard
            label={<ACC.Content value={x.textContent}/>}
            route={x.link}
            key={i}
            qa={`overview-link-${x.link.routeName}`}
            messages={x.messages && x.messages()}
          />)}
      </ACC.NavigationCardsGrid>
    );
  }

  private getPcrMessages(project: ProjectDto) {
    const result: ACC.NavigationCardMessage[] = [];
    if (project.roles & ProjectRole.ProjectManager) {
      if (project.pcrsQueried > 0) {
        result.push({ message: <ACC.Content value={x => x.projectOverview.messages.pcrQueried()} /> });
      }
    }
    if (project.roles & ProjectRole.MonitoringOfficer) {
      result.push({ message: <ACC.Content value={x => x.projectOverview.messages.pcrsToReview(project.pcrsToReview)} /> });
    }
    return result;
  }

  private getClaimMessages(project: ProjectDto, partner: PartnerDto) {
    const result: ACC.NavigationCardMessage[] = [];

    if (project.roles & ProjectRole.FinancialContact) {
      switch (partner.claimStatus) {
        case PartnerClaimStatus.NoClaimsDue:
          result.push({ message: <ACC.Content value={x => x.projectOverview.messages.noClaimDue()} /> });
          break;
        case PartnerClaimStatus.ClaimDue:
          result.push({ message: <ACC.Content value={x => x.projectOverview.messages.claimDue()} /> });
          break;
        case PartnerClaimStatus.ClaimsOverdue:
          result.push({ message: <ACC.Content value={x => x.projectOverview.messages.claimOverdue()} /> });
          break;
        case PartnerClaimStatus.ClaimQueried:
          result.push({ message: <ACC.Content value={x => x.projectOverview.messages.claimQueried()} /> });
          break;
        case PartnerClaimStatus.ClaimSubmitted:
          result.push({ message: <ACC.Content value={x => x.projectOverview.messages.claimSubmitted()} /> });
          break;
        case PartnerClaimStatus.IARRequired:
          result.push({ message: <ACC.Content value={x => x.projectOverview.messages.iarRequired()} /> });
      }
    }

    if (project.roles & ProjectRole.MonitoringOfficer) {
      result.push({ message: <ACC.Content value={x => x.projectOverview.messages.claimsToReview(project.claimsToReview)} /> });
    }

    return result;
  }

}

const ProjectOverviewContainer = (props: Params & BaseProps) => {
  return (
    <StoresConsumer>
      {
        stores =>
          <ProjectOverviewComponent
            projectDetails={stores.projects.getById(props.projectId)}
            partners={stores.partners.getPartnersForProject(props.projectId)}
            user={stores.users.getCurrentUser()}
            {...props}
          />
      }
    </StoresConsumer>
  );
};

export const ProjectOverviewRoute = defineRoute({
  routeName: "projectOverview",
  routePath: "/projects/:projectId/overview",
  getParams: (r) => ({ projectId: r.params.projectId }),
  container: ProjectOverviewContainer,
  accessControl: (auth, params) => auth.forProject(params.projectId).hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer),
  getTitle: ({ content }) => content.projectOverview.title(),
});
