import React from "react";
import * as ACC from "../../components";
import * as Actions from "../../redux/actions";
import * as Selectors from "../../redux/selectors";
import { ProjectDto, ProjectRole } from "@framework/dtos";
import { Pending } from "@shared/pending";
import { PCRDetailsRoute } from "@ui/containers";
import { ContainerBase, ReduxContainer } from "@ui/containers/containerBase";

interface Params {
  projectId: string;
  projectChangeRequestId: string;
  itemId: string;
}

interface Data {
  project: Pending<ProjectDto>;
}

interface Callbacks {}

class ProjectChangeRequestItemUploadContainer extends ContainerBase<Params, Data, Callbacks> {
  render() {
    const combined = Pending.combine({project: this.props.project});

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project)}/>;
  }

  private renderContents(project: ProjectDto) {
    return (
      <ACC.Page
        backLink={<ACC.BackLink route={PCRDetailsRoute.getLink({projectId: this.props.projectId, pcrId: this.props.projectChangeRequestId})}>Back to request</ACC.BackLink>}
        project={project}
        pageTitle={<ACC.Projects.Title project={project} />}
      >
        <ACC.Section>
          <div>
            <p>
              You need to submit a <a href="#1">reallocate project costs spreadsheet</a>. In the yellow boxes enter the names
              of all partner
              organisations, their current costs and the costs you are proposing. Enter all partners’ details. There are
              separate tables for businesses and academic organisations.
            </p>
            <p>
              You must not:
              <ul>
                <li>increase the combined grant funding within the collaboration</li>
                <li>exceed any individual partner’s award rate limit</li>
              </ul>
            </p>
            <p>You should not increase the overhead percentage rate.</p>
          </div>
        </ACC.Section>
      </ACC.Page>
    );
  }
}

const definition = ReduxContainer.for<Params, Data, Callbacks>(ProjectChangeRequestItemUploadContainer);

export const ProjectChangeRequestItemUpload = definition.connect({
  withData: (state, params) => ({
    project: Selectors.getProject(params.projectId).getPending(state),
  }),
  withCallbacks: () => ({})
});

export const ProjectChangeRequestItemUploadRoute = definition.route({
  routeName: "projectChangeRequestItemUpload",
  routePath: "/projects/:projectId/projectChangeRequests/:projectChangeRequestId/prepare/item/:itemId",
  getParams: (route) => ({
    projectId: route.params.projectId,
    projectChangeRequestId: route.params.projectChangeRequestId,
    itemId: route.params.itemId,
  }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadPcr(params.projectId, params.projectChangeRequestId)
  ],
  getTitle: (store, params) => {
    const projectChangeRequestItem = Selectors.getPcrItem(params.projectId, params.projectChangeRequestId, params.itemId).getPending(store).then(x => x && x.typeName).data;
    return {
      htmlTitle: projectChangeRequestItem ? `Upload files to ${projectChangeRequestItem.toLowerCase()}` : "Upload files",
      displayTitle: projectChangeRequestItem ? `Upload files to ${projectChangeRequestItem.toLowerCase()}` : "Upload files"
    };
  },
  container: ProjectChangeRequestItemUpload,
  accessControl: (auth, {projectId}, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasRole(ProjectRole.ProjectManager)
});
