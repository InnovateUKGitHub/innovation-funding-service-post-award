import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { Pending } from "../../../shared/pending";
import * as Actions from "../../redux/actions/thunks";
import * as Dtos from "../../models";
import * as ACC from "../../components";
import { routeConfig } from "../../routing";
import { access } from "fs";

interface Params {
    projectId: string;
    claimId: string;
}

interface Data {
    id: string;
    projectDetails: Pending<Dtos.ProjectDto>;
    costCategories: Pending<Dtos.CostCategoryDto[]>;
}

export class ClaimsDetailsComponent extends ContainerBase<Params, Data, {}> {

    public render() {
        const combined = Pending.combine(this.props.projectDetails, this.props.costCategories, (projectDetails,costCategories) => ({projectDetails,costCategories}));

        const Loading = ACC.Loading.forData(combined);
        return <Loading.Loader render={(data) => this.renderContents(data.projectDetails, data.costCategories, this.props.claimId)} />;
    }

    private renderContents(project: Dtos.ProjectDto, costCategories: Dtos.CostCategoryDto[], claimId: string) {
        const CostCategoriesTable = ACC.Table.forData(costCategories);

        return (
            <ACC.Page>
                <ACC.Section>
                    <ACC.BackLink route={routeConfig.claimsDashboard.getLink({projectId: project.id})}>Claims dashboard</ACC.BackLink>
                </ACC.Section>
                <ACC.Projects.Title pageTitle="Claim" project={project}/>
                <ACC.Claims.Navigation projectId={project.id} claimId={claimId} currentRouteName={routeConfig.claimDetails.routeName} />
                <ACC.Section title="Jabbertype claim for Q3 August to October 2017">
                    <CostCategoriesTable.Table>
                        <CostCategoriesTable.String header="Costs category" qa="category" value={x => x.name}/>
                    </CostCategoriesTable.Table>
                </ACC.Section>
            </ACC.Page>
        );
    }
}

const definition = ReduxContainer.for<Params, Data, {}>(ClaimsDetailsComponent);

export const ClaimsDetails = definition.connect({
    withData: (store, params) => ({
        id: params.projectId,
        projectDetails: Pending.create(store.data.project[params.projectId]),
        costCategories: Pending.create(store.data.costCategories.all)
    }),
    withCallbacks: () => ({})
});

export const ClaimsDetailsRoute = definition.route({
    routeName: "claimDashboard",
    routePath: "/project/:projectId/claims/:claimId",
    getParams: (route) => ({projectId: route.params.projectId, claimId: route.params.claimId}),
    getLoadDataActions: (params) => [
        Actions.loadProject(params.projectId),
        Actions.loadCostCategories(),
    ],
    container: ClaimsDetails
});
