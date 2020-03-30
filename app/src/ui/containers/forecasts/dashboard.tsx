import React from "react";
import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import * as ACC from "../../components";
import { Pending } from "@shared/pending";
import { ClaimDto, PartnerDto, ProjectDto, ProjectRole } from "@framework/dtos";
import { StoresConsumer } from "@ui/redux";

interface Data {
  projectDetails: Pending<ProjectDto>;
  partners: Pending<PartnerDto[]>;
  activeClaims: Pending<ClaimDto[]>;
}

interface Params {
  projectId: string;
}

interface Callbacks {}

class ProjectForecastComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const combined = Pending.combine({projectDetails: this.props.projectDetails, partners: this.props.partners, activeClaims: this.props.activeClaims});
    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.projectDetails, x.partners, x.activeClaims)} />;
  }

  private renderContents(project: ProjectDto, partners: PartnerDto[], activeClaims: ClaimDto[]) {
    const Table = ACC.TypedTable<PartnerDto>();

    const getForecastsAndCosts = (partner: PartnerDto) => {
      const claim = activeClaims.find(x => x.partnerId === partner.id);
      const claimCost = claim ? claim.totalCost || 0 : 0;
      return claimCost + (partner.totalFutureForecastsForParticipants || 0) + (partner.totalParticipantCostsClaimed || 0);
    };

    return (
      <ACC.Page
        pageTitle={<ACC.Projects.Title project={project}/>}
        backLink={<ACC.Projects.ProjectBackLink project={project} routes={this.props.routes}/>}
        project={project}
      >
        <ACC.Section qa="project-forecasts">
          <Table.Table data={partners} qa="partner-table">
            <Table.Custom header="Partner" value={x => <ACC.PartnerName partner={x} showIsLead={true}/>} qa="partner" />
            <Table.Currency header="Total eligible costs" value={x => x.totalParticipantGrant} qa="grant-offered" />
            <Table.Currency header="Forecasts and costs" value={x => getForecastsAndCosts(x)} qa="forecasts-and-costs" />
            <Table.Currency header="Underspend" value={x => x.totalParticipantGrant! - getForecastsAndCosts(x)} qa="underspend" />
            <Table.ShortDate header="Date of last update" value={x => x.forecastLastModifiedDate} qa="last-updated" />
            <Table.Link header="Action" hideHeader={true} value={x => this.props.routes.forecastDetails.getLink({ projectId: this.props.projectId, partnerId: x.id })} content="View forecast" qa="view-partner-forecast" />
          </Table.Table>
        </ACC.Section>
      </ACC.Page>
    );
  }
}

const ForecastDashboardContainer = (props: Params & BaseProps) => (
  <StoresConsumer>
    {stores => (
      <ProjectForecastComponent
        projectDetails={stores.projects.getById(props.projectId)}
        partners={stores.partners.getPartnersForProject(props.projectId)}
        activeClaims={stores.claims.getActiveClaimsForProject(props.projectId)}
        {...props}
      />
    )}
  </StoresConsumer>
);

export const ForecastDashboardRoute = defineRoute({
  routeName: "projectForecasts",
  routePath: "/projects/:projectId/forecasts",
  container: ForecastDashboardContainer,
  getParams: (r) => ({ projectId: r.params.projectId }),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager),
  getTitle: () => {
    return {
      htmlTitle: "Forecasts - View project",
      displayTitle: "Forecasts"
    };
  },
});
