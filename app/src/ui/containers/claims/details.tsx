import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import * as ACC from "../../components";
import { Pending } from "../../../shared/pending";
import * as Dtos from "../../models";
import * as Actions from "../../redux/actions/index";

interface Params {
    projectId: string;
    claimId: string;
}

interface DataProps {
    projectDetails: Pending<Dtos.ProjectDto>;
}

const tabListArray = ["Claims", "Project change requests", "Forecasts", "Project details"];

class Component extends ContainerBase<Params, DataProps, {}> {

    public render() {
        const Loading = ACC.Loading.forData(this.props.projectDetails);
        return <Loading.Loader render={(project) => this.renderContents(project)} />;
    }

    private renderContents(project: Dtos.ProjectDto) {
        return (
            <ACC.Page>
                <ACC.Title title="Claim" caption={`${project.projectNumber}:${project.title}`} />
                <ACC.Tabs tabList={tabListArray} selected={"Claims"} />
            </ACC.Page>
        );
    }
}

const definition = ReduxContainer.for<Params, DataProps, {}>(Component);

export const ClaimsDetails = definition.connect({
    withData: (state, params) => ({ projectDetails: Pending.create(state.data.project[params.projectId]) }),
    withCallbacks: () => ({})
});

export const ClaimsDetailsRoute = definition.route({
    routeName: "claimDetails",
    routePath: "/project/:projectId/claims/:claimId",
    getParams: (route) => ({
        projectId: route.params.projectId,
        claimId: route.params.claimId
    }),
    getLoadDataActions: (params) => [
        Actions.loadProject(params.projectId)
    ],
    container: ClaimsDetails
});
