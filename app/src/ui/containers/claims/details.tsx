import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { Pending } from "../../../shared/pending";
import * as Actions from "../../redux/actions/thunks";
import * as Dtos from "../../models";
import * as ACC from "../../components";
import { routeConfig } from "../../routing";

interface Params {
    projectId: string;
    claimId: string;
}

interface Data {
    id: string;
    projectDetails: Pending<Dtos.ProjectDto>;
}

export class ClaimsDetailsComponent extends ContainerBase<Params, Data, {}> {

    public render() {
        const Loading = ACC.Loading.forData(this.props.projectDetails);
        return <Loading.Loader render={(project) => this.renderContents(project, this.props.claimId)} />;
    }

    private renderContents(project: Dtos.ProjectDto, claimId: string) {
        return (
            <ACC.Page>
                <ACC.Section>
                    <ACC.BackLink route={routeConfig.claimsDashboard.getLink({projectId: project.id})}>Claims dashboard</ACC.BackLink>
                </ACC.Section>
                <ACC.Projects.Title pageTitle="Claim" project={project}/>
                <ACC.Claims.Navigation projectId={project.id} claimId={claimId} currentRouteName={routeConfig.claimDetails.routeName} />
            </ACC.Page>
        );
    }
}

const definition = ReduxContainer.for<Params, Data, {}>(ClaimsDetailsComponent);

export const ClaimsDetails = definition.connect({
    withData: (store, params) => ({
        id: params.projectId,
        projectDetails: Pending.create(store.data.project[params.projectId])
    }),
    withCallbacks: () => ({})
});

export const ClaimsDetailsRoute = definition.route({
    routeName: "claimDashboard",
    routePath: "/project/:projectId/claims/:claimId",
    getParams: (route) => ({projectId: route.params.projectId, claimId: route.params.claimId}),
    getLoadDataActions: (params) => [
        Actions.loadProject(params.projectId)
    ],
    container: ClaimsDetails
});
