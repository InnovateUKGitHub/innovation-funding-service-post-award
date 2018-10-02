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
    claimDetails: Pending<Dtos.ClaimDetailsDto[]>;
}

interface CombinedData {
    project: Dtos.ProjectDto;
    partner: Dtos.PartnerDto;
    costCategories: Dtos.CostCategoryDto[];
    claim: Dtos.ClaimDto;
    claimDetails: Dtos.ClaimDetailsDto[];
}

export class ClaimsDetailsComponent extends ContainerBase<Params, Data, {}> {

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
            return `${data.partner.name} claim for P${data.claim.periodId} ${DateTime.fromJSDate(data.claim.periodStartDate).toFormat("MMMM yyyy")}`;
        }
        return `${data.partner.name} claim for P${data.claim.periodId} ${DateTime.fromJSDate(data.claim.periodStartDate).toFormat("MMMM")} to ${DateTime.fromJSDate(data.claim.periodEndDate).toFormat("MMMM yyyy")}`;
    }

    private renderContents(data: { project: Dtos.ProjectDto, partner: Dtos.PartnerDto, costCategories: Dtos.CostCategoryDto[], claim: Dtos.ClaimDto, claimDetails: Dtos.ClaimDetailsDto[] }) {

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

const definition = ReduxContainer.for<Params, Data, {}>(ClaimsDetailsComponent);

export const ClaimsDetails = definition.connect({
    withData: (store, params) => ({
        id: params.projectId,
        project: Pending.create(store.data.project[params.projectId]),
        partner: Pending.create(store.data.partner[params.partnerId]),
        costCategories: Pending.create(store.data.costCategories.all),
        claim: Pending.create(store.data.claim[params.partnerId + "_" + params.periodId]),
        claimDetails: Pending.create(store.data.claimDetails[params.partnerId + "_" + params.periodId])
    }),
    withCallbacks: () => ({})
});

export const ClaimsDetailsRoute = definition.route({
    routeName: "claimDetails",
    routePath: "/projects/:projectId/claims/:partnerId/details/:periodId",
    getParams: (route) => ({ projectId: route.params.projectId, partnerId: route.params.partnerId, periodId: parseInt(route.params.periodId, 10) }),
    getLoadDataActions: (params) => [
        Actions.loadProject(params.projectId),
        Actions.loadPatnersForProject(params.projectId),
        Actions.loadPartner(params.partnerId),
        Actions.loadCostCategories(),
        Actions.loadClaim(params.partnerId, params.periodId),
        Actions.loadClaimDetailsForPartner(params.partnerId, params.periodId)
    ],
    container: ClaimsDetails
});
