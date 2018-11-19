import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { ProjectOverviewPage } from "../../components/projectOverview";
import { Pending } from "../../../shared/pending";
import { ProjectDto } from "../../../types/dtos";
import * as Selectors from "../../redux/selectors";
import * as Actions from "../../redux/actions";
import * as Acc from "../../components";

interface Params {
  projectId: string;
}

interface Data {
  projectDetails: Pending<ProjectDto>;
  partners: Pending<PartnerDto[]>;
}

class Component extends ContainerBase<Params, Data, {}> {
  render() {
    const combined = Pending.combine(this.props.projectDetails, this.props.partners, (projectDetails, partners) => ({projectDetails, partners}));
    const Loader = Acc.TypedLoader<{projectDetails: ProjectDto, partners: PartnerDto[]}>();

    return (<Loader pending={combined} render={x => this.renderContents(x)}/>);
  }

  renderContents({projectDetails, partners} : {projectDetails: ProjectDto, partners: PartnerDto[]}){
    return (
      <ProjectOverviewPage project={projectDetails} partners={partners} selectedTab={AllClaimsDashboardRoute.routeName}>
      </ProjectOverviewPage>
    );
  }
}

const definition = ReduxContainer.for<Params, Data, {}>(Component);

export const AllClaimsDashboard = definition.connect({
  withData: (state, params) => ({
    projectDetails: Selectors.getProject(params.projectId).getPending(state),
    partners: Selectors.findPartnersByProject(params.projectId).getPending(state),
  }),
  withCallbacks: () => ({})
});

export const AllClaimsDashboardRoute = definition.route({
  routeName: "allClaimsDashboard",
  routePath: "/projects/:projectId/claims/dashboard",
  getParams: (route) => ({
    projectId: route.params.projectId,
  }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId),
    Actions.loadPartnersForProject(params.projectId),
  ],
  container: AllClaimsDashboard
});
