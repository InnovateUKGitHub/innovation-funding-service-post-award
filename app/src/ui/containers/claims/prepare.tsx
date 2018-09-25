import React from "react";
import { DateTime } from "luxon";
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
    project: Pending<Dtos.ProjectDto>;
    partner: Pending<Dtos.PartnerDto>;
    costCategories: Pending<Dtos.CostCategoryDto[]>;
    claim: Pending<Dtos.ClaimDto>;
    claimCosts: Pending<Dtos.ClaimCostDto[]>;
}

interface CombinedData {
    project: Dtos.ProjectDto;
    partner: Dtos.PartnerDto;
    costCategories: Dtos.CostCategoryDto[];
    claim: Dtos.ClaimDto;
    claimCosts: Dtos.ClaimCostDto[];
}

const Loader = ACC.TypedLoader<CombinedData>();

export class PrepareComponent extends ContainerBase<Params, Data, {}> {

    public render() {
        const combined = Pending.combine(
            this.props.project,
            this.props.partner,
            this.props.costCategories,
            this.props.claim,
            this.props.claimCosts,
            (project, partner, costCategories, claim, claimCosts) => ({ project, partner, costCategories, claim, claimCosts })
        );

        return <Loader pending={combined} render={(data) => this.renderContents(data)} />;
    }

    private getClaimPeriodTitle(data: any) {
        if (data.project.claimFrequency === Dtos.ClaimFrequency.Monthly) {
            return `${data.partner.name} claim for ${data.claim.periodId} ${DateTime.fromJSDate(data.claim.periodStartDate).toFormat("MMMM yyyy")}`;
        }
        return `${data.partner.name} claim for ${data.claim.periodId} ${DateTime.fromJSDate(data.claim.periodStartDate).toFormat("MMMM")} to ${DateTime.fromJSDate(data.claim.periodEndDate).toFormat("MMMM yyyy")}`;
    }

    private renderContents(data: { project: Dtos.ProjectDto, partner: Dtos.PartnerDto, costCategories: Dtos.CostCategoryDto[], claim: Dtos.ClaimDto, claimCosts: Dtos.ClaimCostDto[] }) {

        const title = this.getClaimPeriodTitle(data);

        return (
            <ACC.Page>
                <ACC.Section>
                    <ACC.BackLink route={routeConfig.claimsDashboard.getLink({ projectId: data.project.id, partnerId: data.partner.id })}>Claims dashboard</ACC.BackLink>
                </ACC.Section>
                <ACC.Projects.Title pageTitle="Claim" project={data.project} />
                <ACC.Claims.Navigation projectId={data.project.id} claimId={data.claim.id} currentRouteName={routeConfig.claimDetails.routeName} />
                <ACC.Section title={title}>
                    <ACC.Claims.ClaimTable {...data} />
                </ACC.Section>
            </ACC.Page>
        );
    }
}

const definition = ReduxContainer.for<Params, Data, {}>(PrepareComponent);

export const PrepareClaim = definition.connect({
    withData: (store, params) => ({
        id: params.projectId,
        project: Pending.create(store.data.project[params.projectId]),
        // todo: fix to be partner for the claim rather than fist partner in project
        partner: Pending.create(store.data.partners[params.projectId]).then(x => x![0]),
        costCategories: Pending.create(store.data.costCategories.all),
        claim: Pending.create(store.data.claim[params.claimId]),
        claimCosts: Pending.create(store.data.claimCosts[params.claimId])
    }),
    withCallbacks: () => ({})
});

export const PrepareClaimRoute = definition.route({
    routeName: "prepare-claim",
    routePath: "/projects/:projectId/claims/:claimId/prepare",
    getParams: (route) => ({ projectId: route.params.projectId, claimId: route.params.claimId }),
    getLoadDataActions: (params) => [
        Actions.loadProject(params.projectId),
        Actions.loadPatnersForProject(params.projectId),
        Actions.loadCostCategories(),
        Actions.loadClaim(params.claimId),
        Actions.loadClaimCosts(params.claimId)
    ],
    container: PrepareClaim
});
