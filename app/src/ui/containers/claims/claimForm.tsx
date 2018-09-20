import React from "react";
import {ContainerBase, ReduxContainer} from "../containerBase";
import {Pending} from "../../../shared/pending";
import * as Actions from "../../redux/actions/thunks";
import * as Dtos from "../../models";
import * as ACC from "../../components";
import {routeConfig} from "../../routing";

interface Params {
  projectId: string;
  claimId: string;
  costCategoryId: number;
}

interface Data {
  claimId: string;
  project: Pending<Dtos.ProjectDto>;
}

export class ClaimFormComponent extends ContainerBase<Params, Data, {}> {

  public render() {
    const Loading = ACC.Loading.forData(this.props.project);
    return <Loading.Loader render={(data) => this.renderContents({ project: data, claimId: this.props.claimId })}/>;
  }

  private renderContents(data: { project: Dtos.ProjectDto, claimId: string }) {
    return (
      <ACC.Page>
        <ACC.Section>
          <ACC.BackLink
            route={routeConfig.claimDetails.getLink({projectId: data.project.id, claimId: data.claimId})}
          >Back
          </ACC.BackLink>
        </ACC.Section>
      </ACC.Page>
    );
  }
}

const definition = ReduxContainer.for<Params, Data, {}>(ClaimFormComponent);

export const ClaimForm = definition.connect({
  withData: (store, params) => ({
    project: Pending.create(store.data.project[params.projectId]),
    claimId: params.claimId
  }),
  withCallbacks: () => ({})
});

export const ClaimFormRoute = definition.route({
  routeName: "claimForm",
  routePath: "/projects/:projectId/claims/:claimId/costs/:costCategoryId/?view",
  getParams: (route) => ({
    projectId: route.params.projectId,
    claimId: route.params.claimId,
    costCategoryId: route.params.costCategoryId
  }),
  getLoadDataActions: (params) => [
    Actions.loadProject(params.projectId)
  ],
  container: ClaimForm
});
