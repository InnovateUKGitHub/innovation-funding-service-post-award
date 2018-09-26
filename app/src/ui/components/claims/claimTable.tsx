import React from "react";
import * as Dtos from "../../models";
import { Link, Renderers, Table } from "..";
import { ClaimCostFormRoute } from "../../containers";

interface Props {
    project: Dtos.ProjectDto;
    partner: Dtos.PartnerDto;
    costCategories: Dtos.CostCategoryDto[];
    claim: Dtos.ClaimDto;
    claimCosts: Dtos.ClaimCostDto[];
}

export const ClaimTable: React.SFC<Props> = (data) => {

    // todo: Hopfully this isCaluclated will come from salesforce for now its hardcoded for Overheads (2)
    const combinedData = data.costCategories.map(x => ({
        category: x,
        cost: data.claimCosts.find(y => y.costCategoryId === x.id) || {} as Dtos.ClaimCostDto,
        isCalculated: x.id === 2,
        isTotal: false
    }));

    // add total row (dosnt have a cost cat so use 0)
    combinedData.push({
        category: {
            name: "Total",
            id: 0,
        },
        cost: {
            costCategoryId: 0,
            remainingOfferCosts: data.claimCosts.reduce((total, item) => total + item.remainingOfferCosts, 0),
            costsClaimedThisPeriod: data.claimCosts.reduce((total, item) => total + item.costsClaimedThisPeriod, 0),
            costsClaimedToDate: data.claimCosts.reduce((total, item) => total + item.costsClaimedToDate, 0),
            offerCosts: data.claimCosts.reduce((total, item) => total + item.offerCosts, 0),
        },
        isCalculated: true,
        isTotal: true
    });

    const CostCategoriesTable = Table.forData(combinedData);

    return (
        <CostCategoriesTable.Table qa="cost-cat" footers={renderFooters(data.project, data.partner, data.claimCosts)}>
            <CostCategoriesTable.Custom
                header="Costs category"
                qa="category"
                cellClassName={x => x.isTotal ? "govuk-!-font-weight-bold" : null}
                value={x => !x.isCalculated
                    ? <Link route={ClaimCostFormRoute.getLink({ projectId: data.project.id, claimId: data.claim.id, costCategoryId: x.category.id })}>{x.category.name}</Link>
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
