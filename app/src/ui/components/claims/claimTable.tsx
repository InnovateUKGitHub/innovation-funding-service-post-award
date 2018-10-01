import React from "react";
import * as Dtos from "../../models";
import { Link, Renderers, Table } from "..";
import { ClaimLineItemsRoute } from "../../containers";

interface Props {
    project: Dtos.ProjectDto;
    partner: Dtos.PartnerDto;
    costCategories: Dtos.CostCategoryDto[];
    claim: Dtos.ClaimDto;
    claimDetails: Dtos.ClaimCostDto[];
}

export const ClaimTable: React.SFC<Props> = (data) => {

    // Todo: filter the cost cats by the project type
    const combinedData = data.costCategories
        .filter(x => x.organistionType === "Industrial")
        .map(x => ({
            category: x,
            cost: data.claimDetails.find(y => y.costCategoryId === x.id) || {} as Dtos.ClaimCostDto,
            isTotal: false
        }));

    // add total row (dosnt have a cost cat so use 0)
    combinedData.push({
        category: {
            name: "Total",
            id: "",
            isCalculated: true,
            competitionType: "Unknown",
            organistionType: "Unknown"
        },
        cost: {
            costCategoryId: "",
            remainingOfferCosts: data.claimDetails.reduce((total, item) => total + item.remainingOfferCosts, 0),
            costsClaimedThisPeriod: data.claimDetails.reduce((total, item) => total + item.costsClaimedThisPeriod, 0),
            costsClaimedToDate: data.claimDetails.reduce((total, item) => total + item.costsClaimedToDate, 0),
            offerCosts: data.claimDetails.reduce((total, item) => total + item.offerCosts, 0),
        },
        isTotal: true
    });

    const CostCategoriesTable = Table.forData(combinedData);
    // TODO stop hardcoding periodId
    return (
        <CostCategoriesTable.Table qa="cost-cat" footers={renderFooters(data.project, data.partner, data.claimDetails)}>
            <CostCategoriesTable.Custom
                header="Costs category"
                qa="category"
                cellClassName={x => x.isTotal ? "govuk-!-font-weight-bold" : null}
                value={x => !x.category.isCalculated
                    ? <Link route={ClaimLineItemsRoute.getLink({ projectId: data.project.id, partnerId: data.partner.id, costCategoryId: x.category.id, periodId: 1 })}>{x.category.name}</Link>
                    : x.category.name}
            />
            <CostCategoriesTable.Currency header="Grant offer letter costs" qa="offerCosts" value={x => x.cost.offerCosts} />
            <CostCategoriesTable.Currency header="Costs claimed to date" qa="claimedToDate" value={x => x.cost.costsClaimedToDate} />
            <CostCategoriesTable.Currency header="Costs this period" qa="periodCosts" value={x => x.cost.costsClaimedThisPeriod} cellClassName={x => x.isTotal ? "govuk-!-font-weight-bold" : null} />
            <CostCategoriesTable.Currency header="Remaining grant offer letter costs" qa="remainingCosts" value={x => x.cost.remainingOfferCosts} />
        </CostCategoriesTable.Table>
    );
};

const  renderFooters = (project: Dtos.ProjectDto, partner: Dtos.PartnerDto, claimsCosts: Dtos.ClaimCostDto[]) => {
    return [
      (
        <tr key="1" className="govuk-table__row">
            <th className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold" colSpan={3}>Award offer rate</th>
            <td className="govuk-table__cell govuk-table__cell--numeric" colSpan={1}><Renderers.Percentage value={partner.awardRate} /></td>
            <td className="govuk-table__cell" colSpan={1} />
        </tr>
      ),
      (
        <tr key="2" className="govuk-table__row">
            <th className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold" colSpan={3}>Costs to be paid this quarter</th>
            <td className="govuk-table__cell govuk-table__cell--numeric" colSpan={1}><Renderers.Currency value={claimsCosts.reduce((total, item) => total + item.costsClaimedThisPeriod, 0) * partner.awardRate / 100} /></td>
            <td className="govuk-table__cell" colSpan={1} />
        </tr>
      )
    ];
};
