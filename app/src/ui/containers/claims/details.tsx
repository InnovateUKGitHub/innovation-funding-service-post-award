import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import { Pending } from "../../../shared/pending";
import * as Actions from "../../redux/actions/thunks";
import * as Dtos from "../../models";
import * as ACC from "../../components";
import { routeConfig } from "../../routing";
import { DateTime } from "luxon";

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

export class ClaimsDetailsComponent extends ContainerBase<Params, Data, {}> {

    public render() {
        const combined = Pending.combine(
            this.props.project,
            this.props.partner,
            this.props.costCategories,
            this.props.claim,
            this.props.claimCosts,
            (project, partner, costCategories, claim, claimCosts) => ({ project, partner, costCategories, claim, claimCosts })
        );

        const Loading = ACC.Loading.forData(combined);
        return <Loading.Loader render={(data) => this.renderContents(data)} />;
    }

    private renderContents(data: { project: Dtos.ProjectDto, partner: Dtos.PartnerDto, costCategories: Dtos.CostCategoryDto[], claim: Dtos.ClaimDto, claimCosts: Dtos.ClaimCostDto[] }) {

        const combinedData = data.costCategories.map(x => ({
            category: x,
            cost: data.claimCosts.find(y => y.costCategoryId === x.id) || {} as Dtos.ClaimCostDto,
            isCalculated: x.id === 2,
            isTotal: false
        }));

        combinedData.push({
            category: {
                name: "Total",
                id: 0,
            },
            cost: {
                costCategoryId: 8,
                remainingOfferCosts: data.claimCosts.reduce((total, item) => total + item.remainingOfferCosts, 0),
                costsClaimedThisPeriod: data.claimCosts.reduce((total, item) => total + item.costsClaimedThisPeriod, 0),
                costsClaimedToDate: data.claimCosts.reduce((total, item) => total + item.costsClaimedToDate, 0),
                offerCosts: data.claimCosts.reduce((total, item) => total + item.offerCosts, 0),
            },
            isCalculated: true,
            isTotal: true
        });

        let title = ``;
        switch (data.project.claimFrequency) {
            case Dtos.ClaimFrequency.Monthly:
                title = `${data.partner.name} claim for ${data.claim.periodId} ${DateTime.fromJSDate(data.claim.periodStartDate).toFormat("MMMM yyyy")}`;
            default:
                title = `${data.partner.name} claim for ${data.claim.periodId} ${DateTime.fromJSDate(data.claim.periodStartDate).toFormat("MMMM")} to ${DateTime.fromJSDate(data.claim.periodEndDate).toFormat("MMMM yyyy")}`;

        }

        const CostCategoriesTable = ACC.Table.forData(combinedData);

        return (
            <ACC.Page>
                <ACC.Section>
                    <ACC.BackLink route={routeConfig.claimsDashboard.getLink({ projectId: data.project.id, partnerId: "" })}>Claims dashboard</ACC.BackLink>
                </ACC.Section>
                <ACC.Projects.Title pageTitle="Claim" project={data.project} />
                <ACC.Claims.Navigation projectId={data.project.id} claimId={data.claim.id} currentRouteName={routeConfig.claimDetails.routeName} />
                <ACC.Section title={title}>
                    <CostCategoriesTable.Table footers={this.renderFooters(data.project, data.partner, data.claimCosts)}>
                        <CostCategoriesTable.Custom header="Costs category" qa="category" value={x => !x.isCalculated ? <a href="#" className="govuk-link">{x.category.name}</a> : x.category.name} cellClassName={x => x.isTotal ? "govuk-!-font-weight-bold" : null} />
                        <CostCategoriesTable.Currency header="Grant offer letter costs" qa="offerCosts" value={x => x.cost.offerCosts} />
                        <CostCategoriesTable.Currency header="Costs claimed to date" qa="claimedToDate" value={x => x.cost.costsClaimedToDate} />
                        <CostCategoriesTable.Currency header="Costs this period" qa="periodCosts" value={x => x.cost.costsClaimedThisPeriod} cellClassName={x => x.isTotal ? "govuk-!-font-weight-bold" : null} />
                        <CostCategoriesTable.Currency header="Remaining grant offer letter costs" qa="remainingCosts" value={x => x.cost.remainingOfferCosts} />
                    </CostCategoriesTable.Table>
                </ACC.Section>
            </ACC.Page>
        );
    }

    private renderFooters(project: Dtos.ProjectDto, partner: Dtos.PartnerDto, claimsCosts: Dtos.ClaimCostDto[]) {
        return [
            <tr className="govuk-table__row">
                <th className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold" colSpan={3}>Award offer rate</th>
                <td className="govuk-table__cell govuk-table__cell--numeric" colSpan={1}><ACC.Renderers.Percentage value={partner.awardRate} /></td>
                <td className="govuk-table__cell" colSpan={1} />
            </tr>,
            <tr className="govuk-table__row">
                <th className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold" colSpan={3}>Costs to be paid this quarter</th>
                <td className="govuk-table__cell govuk-table__cell--numeric" colSpan={1}><ACC.Renderers.Currency value={claimsCosts.reduce((total, item) => total + item.costsClaimedThisPeriod, 0) * partner.awardRate / 100} /></td>
                <td className="govuk-table__cell" colSpan={1} />
            </tr>
        ];
    }
}

const definition = ReduxContainer.for<Params, Data, {}>(ClaimsDetailsComponent);

export const ClaimsDetails = definition.connect({
    withData: (store, params) => ({
        id: params.projectId,
        project: Pending.create(store.data.project[params.projectId]),
        partner: Pending.create(store.data.partners[params.projectId]).then(x => x![0]),
        costCategories: Pending.create(store.data.costCategories.all),
        claim: Pending.create(store.data.claim[params.claimId]),
        claimCosts: Pending.create(store.data.claimCosts[params.claimId])
    }),
    withCallbacks: () => ({})
});

export const ClaimsDetailsRoute = definition.route({
    routeName: "claimDetails",
    routePath: "/project/:projectId/claims/:claimId",
    getParams: (route) => ({ projectId: route.params.projectId, claimId: route.params.claimId }),
    getLoadDataActions: (params) => [
        Actions.loadProject(params.projectId),
        Actions.loadPatnersForProject(params.projectId),
        Actions.loadCostCategories(),
        Actions.loadClaim(params.claimId),
        Actions.loadClaimCosts(params.claimId)
    ],
    container: ClaimsDetails
});
