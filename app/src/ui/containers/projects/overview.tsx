import React from "react";

import { ProjectForecastRoute } from "./projectForecasts";
import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import * as Dtos from "@framework/dtos";
import { Pending } from "@shared/pending";
import { IClientUser, PartnerDto, ProjectDto, ProjectRole } from "@framework/types";
import { ProjectDashboardRoute } from "./dashboard";
import { AllClaimsDashboardRoute, ClaimsDashboardRoute, ViewForecastRoute } from "../claims";
import * as ACC from "@ui/components";
import { MonitoringReportDashboardRoute } from "../monitoringReports";
import { ProjectChangeRequestsRoute } from "./projectChangeRequests";
import { ProjectDocumentsRoute } from "./projectDocuments";
import { ProjectDetailsRoute } from "./details";
import { IClientConfig } from "@ui/redux/reducers/configReducer";
import { NavigationCard } from "@ui/components";
import { PCRsDashboardRoute } from "../pcrs/dashboard";
import { StoresConsumer } from "@ui/redux";

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

  renderContents(project: Dtos.ProjectDto, partners: Dtos.PartnerDto[], contacts: ProjectContactDto[]) {

    const projectId = project.id;
    // find first partner with role
    const partner = partners.filter(x => x.roles !== ProjectRole.Unknown)[0];

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={ProjectDashboardRoute.getLink({})}>Back to projects</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
      >
        {this.renderProjectOveriewDetails(project, partner)}
        {this.renderLinks(projectId, partner && partner.id || partners[0].id, project.roles)}
      </ACC.Page>
    );
  }

  private renderProjectOveriewDetails(project: ProjectDto, partner: PartnerDto) {
    if ((project.roles & ProjectRole.ProjectManager) && partner) {
      return this.renderPMOverviewDetails(project, partner);
    }

    if ((project.roles & ProjectRole.MonitoringOfficer)) {
      return this.renderMOOverviewDetails(project);
    }

    if ((project.roles & ProjectRole.FinancialContact) && partner) {
      return this.renderFCOverviewDetails(partner);
    }

    return null;
  }

  private renderFCOverviewDetails(partner: PartnerDto) {
    const PartnerSummaryDetails = ACC.TypedDetails<PartnerDto>();

    return (
      <ACC.Section>
        <ACC.SectionPanel qa="claims-totals" title="History">
          <ACC.DualDetails displayDensity="Compact">
            <PartnerSummaryDetails.Details qa="claims-totals-col-0" data={partner}>
              <PartnerSummaryDetails.Currency label="Total eligible costs" qa="gol-costs" value={x => x.totalParticipantGrant} />
              <PartnerSummaryDetails.Currency label="Eligible costs claimed to date" qa="claimed-costs" value={x => x.totalParticipantCostsClaimed || 0} />
              <PartnerSummaryDetails.Percentage label="Percentage of eligible costs claimed to date" qa="percentage-costs" value={x => x.percentageParticipantCostsClaimed} />
              <PartnerSummaryDetails.Currency label="Costs paid to date" qa="paid-costs" value={x => x.totalPaidCosts || 0} />
            </PartnerSummaryDetails.Details>
            <PartnerSummaryDetails.Details qa="claims-totals-col-1" data={partner}>
              <PartnerSummaryDetails.Percentage label="Funding level" value={x => x.awardRate} qa="award-rate" fractionDigits={0} />
              <PartnerSummaryDetails.Percentage label="Claim cap" value={x => x.capLimit} fractionDigits={0} qa="cap-limit" />
            </PartnerSummaryDetails.Details>
          </ACC.DualDetails>
        </ACC.SectionPanel>
      </ACC.Section>
    );
  }

  private renderPMOverviewDetails(project: ProjectDto, partner: PartnerDto) {
    const ProjectSummaryDetails = ACC.TypedDetails<ProjectDto>();
    const PartnerSummaryDetails = ACC.TypedDetails<PartnerDto>();
    return (
      <ACC.Section>
        <ACC.SectionPanel qa="claims-summary">
          <ACC.DualDetails>
            <ProjectSummaryDetails.Details title="History" data={project} qa="project-summary">
              <ProjectSummaryDetails.Currency label="Total eligible costs" qa="gol-costs" value={x => x.grantOfferLetterCosts} />
              <ProjectSummaryDetails.Currency label="Eligible costs claimed to date" qa="claimed-costs" value={x => x.costsClaimedToDate || 0} />
              <ProjectSummaryDetails.Percentage label="Percentage of eligible costs claimed to date" qa="claimed-percentage" value={x => x.claimedPercentage} />
            </ProjectSummaryDetails.Details>
            <PartnerSummaryDetails.Details data={partner} title={`${partner.name} history`} qa="lead-partner-summary">
              <PartnerSummaryDetails.Currency label="Total eligible costs" qa="gol-costs" value={x => x.totalParticipantGrant} />
              <PartnerSummaryDetails.Currency label="Eligible costs claimed to date" qa="claimed-costs" value={x => x.totalParticipantCostsClaimed || 0} />
              <PartnerSummaryDetails.Percentage label="Percentage of eligible costs claimed to date" qa="claimed-percentage" value={x => x.percentageParticipantCostsClaimed} />
              <PartnerSummaryDetails.Currency label="Costs paid to date" qa="paid-costs" value={x => x.totalPaidCosts || 0} />
              <PartnerSummaryDetails.Percentage label="Funding level" value={x => x.awardRate} qa="award-rate" fractionDigits={0} />
              <PartnerSummaryDetails.Percentage label="Claim cap" value={x => x.capLimit} fractionDigits={0} qa="cap-limit" />
            </PartnerSummaryDetails.Details>
          </ACC.DualDetails>
        </ACC.SectionPanel>
      </ACC.Section>
    );
  }

  private renderMOOverviewDetails(project: ProjectDto) {
    const ProjectSummaryDetails = ACC.TypedDetails<ProjectDto>();
    return (
      <ACC.Section>
        <ACC.SectionPanel qa="claims-summary">
          <ACC.DualDetails>
            <ProjectSummaryDetails.Details title="History" data={project} qa="project-summary">
              <ProjectSummaryDetails.Currency label="Total eligible costs" qa="gol-costs" value={x => x.grantOfferLetterCosts} />
              <ProjectSummaryDetails.Currency label="Eligible costs claimed to date" qa="claimed-costs" value={x => x.costsClaimedToDate || 0} />
              <ProjectSummaryDetails.Percentage label="Percentage of eligible costs claimed to date" qa="claimed-percentage" value={x => x.claimedPercentage} />
            </ProjectSummaryDetails.Details>
          </ACC.DualDetails>
        </ACC.SectionPanel>
      </ACC.Section>
    );
  }

  private renderLinks(projectId: string, partnerId: string, projectRole: ProjectRole) {
    let links = [
      { text: "Claims", link: AllClaimsDashboardRoute.getLink({ projectId }) },
      { text: "Claims", link: ClaimsDashboardRoute.getLink({ projectId, partnerId }) },
      { text: "Monitoring reports", link: MonitoringReportDashboardRoute.getLink({ projectId }) },
      { text: "Forecasts", link: ProjectForecastRoute.getLink({ projectId }) },
      { text: "Forecast", link: ViewForecastRoute.getLink({ projectId, partnerId }) },
      { text: "Project change requests", link: ProjectChangeRequestsRoute.getLink({ projectId }) },
      { text: "Project change requests", link: PCRsDashboardRoute.getLink({ projectId }) },
      { text: "Documents", link: ProjectDocumentsRoute.getLink({ projectId }) },
      { text: "Details", link: ProjectDetailsRoute.getLink({ id: projectId }) },
    ].filter(x => x.link.accessControl(this.props.user, this.props.config));

    // special case if not fc shouldnt have link to ViewForecastRoute from this page... the view forecast route has permission from the project forecasts route
    if (projectRole & (ProjectRole.MonitoringOfficer | ProjectRole.ProjectManager)) {
      links = links.filter(x => x.link.routeName !== ViewForecastRoute.routeName);
    }

    return (
      <ACC.NavigationCardsGrid>
        {links.map((x, i) => <NavigationCard label={x.text} route={x.link} key={i} qa={`overview-link-${x.link.routeName}`} />)}
      </ACC.NavigationCardsGrid>
    );
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
