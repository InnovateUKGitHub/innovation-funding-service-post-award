import React from "react";

import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import * as Dtos from "@framework/dtos";
import { Pending } from "@shared/pending";
import { IClientUser, PartnerClaimStatus, PartnerDto, ProjectDto, ProjectRole, ProjectStatus } from "@framework/types";
import * as ACC from "@ui/components";
import { IClientConfig } from "@ui/redux/reducers/configReducer";
import { StoresConsumer } from "@ui/redux";
import { IRoutes } from "@ui/routing";

interface Data {
  projectDetails: Pending<Dtos.ProjectDto>;
  partners: Pending<Dtos.PartnerDto[]>;
  contacts: Pending<ProjectContactDto[]>;
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
      contacts: this.props.contacts,
    });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.partners, x.contacts)} />;
  }

  private isPartnerWithdrawn(project: Dtos.ProjectDto, partners: Dtos.PartnerDto[]) {
    if (project.roles & ProjectRole.ProjectManager) {
      const leadPartner = partners.find(x => x.isLead);
      return leadPartner && leadPartner.isWithdrawn;
    }
    return partners.some(p => !!(p.roles & ProjectRole.FinancialContact) && p.isWithdrawn);
  }

  renderContents(project: Dtos.ProjectDto, partners: Dtos.PartnerDto[], contacts: ProjectContactDto[]) {
    // find first partner with role
    const partner = partners.filter(x => x.roles !== ProjectRole.Unknown)[0];

    const isProjectClosed = project.status === ProjectStatus.Closed || project.status === ProjectStatus.Terminated;

    const title = isProjectClosed || project.isPastEndDate || this.isPartnerWithdrawn(project, partners)
      ? "Project ended"
      : `Project period ${project.periodId} of ${project.totalPeriods}`;

    const subtitle = isProjectClosed ? null :
      project.isPastEndDate || this.isPartnerWithdrawn(project, partners)
        ? "Final claim period"
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
      <ACC.SectionPanel qa="claims-totals" title={`${partner.name} costs to date`}>
        <ACC.DualDetails displayDensity="Compact">
          <PartnerSummaryDetails.Details qa="claims-totals-col-0" data={partner}>
            <PartnerSummaryDetails.Currency label="Total eligible costs" qa="gol-costs" value={x => x.totalParticipantGrant} />
            <PartnerSummaryDetails.Currency label="Eligible costs claimed to date" qa="claimed-costs" value={x => x.totalParticipantCostsClaimed || 0} />
            <PartnerSummaryDetails.Percentage label="Percentage of eligible costs claimed to date" qa="percentage-costs" value={x => x.percentageParticipantCostsClaimed} />
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
          <ProjectSummaryDetails.Details title="Project costs to date" data={project} qa="project-summary">
            <ProjectSummaryDetails.Currency label="Total eligible costs" qa="gol-costs" value={x => x.grantOfferLetterCosts} />
            <ProjectSummaryDetails.Currency label="Eligible costs claimed to date" qa="claimed-costs" value={x => x.costsClaimedToDate || 0} />
            <ProjectSummaryDetails.Percentage label="Percentage of eligible costs claimed to date" qa="claimed-percentage" value={x => x.claimedPercentage} />
          </ProjectSummaryDetails.Details>
          <PartnerSummaryDetails.Details data={partner} title={`${partner.name} costs to date`} qa="lead-partner-summary">
            <PartnerSummaryDetails.Currency label="Total eligible costs" qa="gol-costs" value={x => x.totalParticipantGrant} />
            <PartnerSummaryDetails.Currency label="Eligible costs claimed to date" qa="claimed-costs" value={x => x.totalParticipantCostsClaimed || 0} />
            <PartnerSummaryDetails.Percentage label="Percentage of eligible costs claimed to date" qa="claimed-percentage" value={x => x.percentageParticipantCostsClaimed} />
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
      { text: "Claims", link: routes.allClaimsDashboard.getLink({ projectId }), messages: () => this.getClaimMessages(project, partner) },
      { text: "Claims", link: routes.claimsDashboard.getLink({ projectId, partnerId }), messages: () => this.getClaimMessages(project, partner) },
      { text: "Monitoring reports", link: routes.monitoringReportDashboard.getLink({ projectId }) },
      { text: "Forecasts", link: routes.forecastDashboard.getLink({ projectId }) },
      { text: "Forecast", link: routes.forecastDetails.getLink({ projectId, partnerId }) },
      { text: "Project change requests", link: routes.projectChangeRequests.getLink({ projectId }), messages: () => this.getPcrMessages(project) },
      { text: "Project change requests", link: routes.pcrsDashboard.getLink({ projectId }), messages: () => this.getPcrMessages(project) },
      { text: "Documents", link: routes.projectDocuments.getLink({ projectId }) },
      { text: "Project details", link: routes.projectDetails.getLink({ id: projectId }) },
      { text: "Finance summary", link: routes.financeSummary.getLink({ projectId, partnerId }) },
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
            label={x.text}
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
      if (project.pcrsQueried > 0) result.push({ message: "Request queried" });
    }
    if (project.roles & ProjectRole.MonitoringOfficer) {
      result.push({ message: `Requests to review: ${project.pcrsToReview}` });
    }
    return result;
  }

  private getClaimMessages(project: ProjectDto, partner: PartnerDto) {
    const result: ACC.NavigationCardMessage[] = [];

    if (project.roles & ProjectRole.FinancialContact) {
      switch (partner.claimStatus) {
        case PartnerClaimStatus.NoClaimsDue:
          result.push({ message: "No claim due" });
          break;
        case PartnerClaimStatus.ClaimDue:
          result.push({ message: "Claim due" });
          break;
        case PartnerClaimStatus.ClaimsOverdue:
          result.push({ message: "Claim overdue" });
          break;
        case PartnerClaimStatus.ClaimQueried:
          result.push({ message: "Claim queried" });
          break;
        case PartnerClaimStatus.ClaimSubmitted:
          result.push({ message: "Claim submitted" });
          break;
        case PartnerClaimStatus.IARRequired:
          result.push({ message: "IAR required" });
      }
    }

    if (project.roles & ProjectRole.MonitoringOfficer) {
      result.push({
        message: "Claims to review: " + project.claimsToReview
      });
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
            contacts={stores.contacts.getAllByProjectId(props.projectId)}
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
  getTitle: () => ({
    htmlTitle: "Project overview",
    displayTitle: "Project overview"
  }),
});
