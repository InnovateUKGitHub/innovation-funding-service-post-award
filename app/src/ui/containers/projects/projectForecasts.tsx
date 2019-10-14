import React from "react";
import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import * as ACC from "../../components";
import { Pending } from "@shared/pending";
import { PartnerDto, ProjectDto, ProjectRole } from "@framework/dtos";
import { StoresConsumer } from "@ui/redux";

interface Data {
  projectDetails: Pending<ProjectDto>;
  partners: Pending<PartnerDto[]>;
}

interface Params {
  projectId: string;
}

interface Callbacks {}

class ProjectForecastComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const combined = Pending.combine({projectDetails: this.props.projectDetails, partners: this.props.partners});
    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.projectDetails, x.partners)} />;
  }

  private renderContents(project: ProjectDto, partners: PartnerDto[]) {
    const Table = ACC.TypedTable<PartnerDto>();

    return (
      <ACC.Page
        pageTitle={<ACC.Projects.Title project={project}/>}
        backLink={<ACC.Projects.ProjectBackLink project={project} routes={this.props.routes}/>}
        project={project}
      >
        <ACC.Section qa="project-forecasts">
          <Table.Table data={partners} qa="partner-table">
            <Table.String header="Partner" value={x => x.name + (x.isLead ? " (Lead)" : "")} qa="partner" />
            <Table.Currency header="Total eligible costs" value={x => x.totalParticipantGrant} qa="grant-offered" />
            <Table.Currency header="Forecasts and costs" value={x => (x.totalFutureForecastsForParticipants || 0) + (x.totalCostsSubmitted || 0)} qa="forecasts-and-costs" />
            <Table.Currency header="Underspend" value={x => x.totalParticipantGrant! - (x.totalFutureForecastsForParticipants || 0) - (x.totalCostsSubmitted || 0)} qa="underspend" />
            <Table.ShortDate header="Date of last update" value={x => x.forecastLastModifiedDate} qa="last-updated" />
            <Table.Link header="Action" hideHeader={true} value={x => this.props.routes.viewForecast.getLink({ projectId: this.props.projectId, partnerId: x.id })} content="View forecast" qa="view-partner-forecast" />
          </Table.Table>
        </ACC.Section>
      </ACC.Page>
    );
  }
}

const ProjectForecastContainer = (props: Params & BaseProps) => (
  <StoresConsumer>
    {stores => (
      <ProjectForecastComponent
        projectDetails={stores.projects.getById(props.projectId)}
        partners={stores.partners.getPartnersForProject(props.projectId)}
        {...props}
      />
    )}
  </StoresConsumer>
);

export const ProjectForecastRoute = defineRoute({
  routeName: "projectForecasts",
  routePath: "/projects/:projectId/forecasts",
  container: ProjectForecastContainer,
  getParams: (r) => ({ projectId: r.params.projectId }),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager),
  getTitle: () => {
    return {
      htmlTitle: "Forecasts - View project",
      displayTitle: "Forecasts"
    };
  },
});
