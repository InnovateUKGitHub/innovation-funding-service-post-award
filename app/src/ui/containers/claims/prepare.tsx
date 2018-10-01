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
    partnerId: string;
    periodId: number;
}

interface Data {
    id: string;
    project: Pending<Dtos.ProjectDto>;
    partner: Pending<Dtos.PartnerDto>;
    costCategories: Pending<Dtos.CostCategoryDto[]>;
    claim: Pending<Dtos.ClaimDto>;
    claimDetails: Pending<Dtos.ClaimCostDto[]>;
}

interface CombinedData {
    project: Dtos.ProjectDto;
    partner: Dtos.PartnerDto;
    costCategories: Dtos.CostCategoryDto[];
    claim: Dtos.ClaimDto;
    claimDetails: Dtos.ClaimCostDto[];
}

export class PrepareComponent extends ContainerBase<Params, Data, {}> {

    public render() {
        const combined = Pending.combine(
            this.props.project,
            this.props.partner,
            this.props.costCategories,
            this.props.claim,
            this.props.claimDetails,
            (project, partner, costCategories, claim, claimDetails) => ({ project, partner, costCategories, claim, claimDetails })
        );

        const Loader = ACC.TypedLoader<CombinedData>();
        return <Loader pending={combined} render={(data) => this.renderContents(data)} />;
    }

    private getClaimPeriodTitle(data: any) {
        if (data.project.claimFrequency === Dtos.ClaimFrequency.Monthly) {
            return `${data.partner.name} claim for ${data.claim.periodId} ${DateTime.fromJSDate(data.claim.periodStartDate).toFormat("MMMM yyyy")}`;
        }
        return `${data.partner.name} claim for ${data.claim.periodId} ${DateTime.fromJSDate(data.claim.periodStartDate).toFormat("MMMM")} to ${DateTime.fromJSDate(data.claim.periodEndDate).toFormat("MMMM yyyy")}`;
    }

    private renderContents(data: { project: Dtos.ProjectDto, partner: Dtos.PartnerDto, costCategories: Dtos.CostCategoryDto[], claim: Dtos.ClaimDto, claimDetails: Dtos.ClaimCostDto[] }) {

        const title = this.getClaimPeriodTitle(data);

        return (
            <ACC.Page>
                <ACC.Section>
                    <ACC.BackLink route={routeConfig.claimsDashboard.getLink({ projectId: data.project.id, partnerId: data.partner.id })}>Claims dashboard</ACC.BackLink>
                </ACC.Section>
                <ACC.Projects.Title pageTitle="Claim" project={data.project} />
                <ACC.Claims.Navigation projectId={data.project.id} partnerId={data.partner.id} periodId={data.claim.periodId} currentRouteName={routeConfig.claimDetails.routeName} />
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
        claim: Pending.create(store.data.claim[params.periodId.toString()]), // ToDo: wire up partner id and period id
        claimDetails: Pending.create(store.data.claimDetails[params.partnerId + "_" + params.periodId])
    }),
    withCallbacks: () => ({})
});

export const PrepareClaimRoute = definition.route({
    routeName: "prepare-claim",
    routePath: "/projects/:projectId/claims/:partnerId/prepare/:periodId",
    getParams: (route) => ({ projectId: route.params.projectId, partnerId: route.params.partnerId, periodId: parseInt(route.params.periodId, 10) }),
    getLoadDataActions: (params) => [
        Actions.loadProject(params.projectId),
        Actions.loadPatnersForProject(params.projectId),
        Actions.loadCostCategories(),
        Actions.loadClaim(params.periodId.toString()), // ToDo: wire up to partner id, period id
        Actions.loadClaimDetailsForPartner(params.partnerId, params.periodId)
    ],
    container: PrepareClaim
});
