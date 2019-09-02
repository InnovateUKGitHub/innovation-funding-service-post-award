import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import * as Acc from "@ui/components";
import { PartnerDto, ProjectDto, ProjectRole } from "@framework/dtos";
import { Pending } from "@shared/pending";
import * as Selectors from "../../redux/selectors";
import * as Actions from "../../redux/actions";
import { ProjectDashboardRoute } from "@ui/containers";

interface Callbacks { }

interface Data {
  projectDetails: Pending<ProjectDto>;
  partners: Pending<PartnerDto[]>;
}

interface CombinedData {
  projectDetails: ProjectDto;
  partners: PartnerDto[];
}

interface Params {
  projectId: string;
}

class ProjectChangeRequestsComponent extends ContainerBase<Params, Data, Callbacks> {
  render() {

    const combined = Pending.combine({
      projectDetails: this.props.projectDetails,
      partners: this.props.partners,
    });

    return <Acc.PageLoader pending={combined} render={x => this.renderContents(x)} />;
  }

  private renderContents({ projectDetails, partners }: CombinedData) {
    return (
      <Acc.Page
        pageTitle={<Acc.Projects.Title project={projectDetails} />}
        backLink={<Acc.Projects.ProjectBackLink project={projectDetails} />}
        project={projectDetails}
      >
        <Acc.Renderers.SimpleString>
          If the project team wish to adjust the details of a project, for example, the allocation of funds across cost categories, the Project Manager must submit a project change request.
            </Acc.Renderers.SimpleString>
        <Acc.Renderers.SimpleString>
          The Project Manager must follow these steps:
            </Acc.Renderers.SimpleString>

        <Acc.Renderers.SimpleString>
          <ol className="govuk-list">
            <li>1. Email the Monitoring Officer to ask for the project change request form and guidance.</li>
            <li>2. Follow the guidance and complete the form.</li>
            <li>3. Email it back to the Monitoring Officer to review.</li>
          </ol>
        </Acc.Renderers.SimpleString>
      </Acc.Page>
    );
  }
}

const containerDefinition = ReduxContainer.for<Params, Data, Callbacks>(ProjectChangeRequestsComponent);

export const ProjectChangeRequests = containerDefinition.connect({
  withData: (state, props) => ({
    projectDetails: Selectors.getProject(props.projectId).getPending(state),
    partners: Selectors.findPartnersByProject(props.projectId).getPending(state),
  }),
  withCallbacks: () => ({})
});

export const ProjectChangeRequestsRoute = containerDefinition.route({
  routeName: "projectChangeRequests",
  routePath: "/projects/:projectId/changeRequests",
  getParams: (route) => ({
    projectId: route.params.projectId,
  }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadPartnersForProject(params.projectId),
  ],
  container: ProjectChangeRequests,
  getTitle: () => ({
    htmlTitle: "Project change requests",
    displayTitle: "Project change requests"
  }),
  // only show page untill pcrs are enabled - this is a holding page untill then...
  accessControl: (auth, { projectId }, config) => !config.features.pcrsEnabled && auth.forProject(projectId).hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer)
});
