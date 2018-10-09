import React from "react";
import * as Dtos from "../../models";
import { Link, Renderers, Table } from "..";

interface Props {
    project: Dtos.ProjectDto;
    partner: Dtos.PartnerDto;
    costCategories: Dtos.CostCategoryDto[];
    claim: Dtos.ClaimDto;
    claimDetails: Dtos.ClaimDetailsSummaryDto[];
    getLink: (costCategoryId: string) => ILinkInfo;
}

export const ClaimTable: React.SFC<Props> = (props) => {

    // Todo: filter the cost cats by the project type
    const combinedData = props.costCategories
        .filter(x => x.organistionType === "Industrial")
        .map(x => ({
            category: x,
            cost: props.claimDetails.find(y => y.costCategoryId === x.id) || {} as Dtos.ClaimDetailsSummaryDto,
            isTotal: false
        }));

    // add total row (dosnt have a cost cat so use 0)
    combinedData.push({
        category: {
            name: "Total",
            id: "",
            isCalculated: true,
            competitionType: "Unknown",
            organistionType: "Unknown",
            description: "",
            hintText: ""
        },
        cost: {
            costCategoryId: "",
            remainingOfferCosts: props.claimDetails.reduce((total, item) => total + item.remainingOfferCosts, 0),
            costsClaimedThisPeriod: props.claimDetails.reduce((total, item) => total + item.costsClaimedThisPeriod, 0),
            costsClaimedToDate: props.claimDetails.reduce((total, item) => total + item.costsClaimedToDate, 0),
            offerCosts: props.claimDetails.reduce((total, item) => total + item.offerCosts, 0),
        },
        isTotal: true
    });

    const CostCategoriesTable = Table.forData(combinedData);

    return (
        <CostCategoriesTable.Table qa="cost-cat" footers={renderFooters(props.project, props.partner, props.claimDetails)}>
            <CostCategoriesTable.Custom
                header="Costs category"
                qa="category"
                cellClassName={x => x.isTotal ? "govuk-!-font-weight-bold" : null}
                value={x => !x.category.isCalculated
                    ? <Link route={props.getLink(x.category.id)}>{x.category.name}</Link>
                    : x.category.name}
            />
            <CostCategoriesTable.Currency header="Grant offer letter costs" qa="offerCosts" value={x => x.cost.offerCosts} />
            <CostCategoriesTable.Currency header="Costs claimed to date" qa="claimedToDate" value={x => x.cost.costsClaimedToDate} />
            <CostCategoriesTable.Currency header="Costs this period" qa="periodCosts" value={x => x.cost.costsClaimedThisPeriod} cellClassName={x => x.isTotal ? "govuk-!-font-weight-bold" : null} />
            <CostCategoriesTable.Currency header="Remaining grant offer letter costs" qa="remainingCosts" value={x => x.cost.remainingOfferCosts} />
        </CostCategoriesTable.Table>
    );
};

const  renderFooters = (project: Dtos.ProjectDto, partner: Dtos.PartnerDto, claimsCosts: Dtos.ClaimDetailsSummaryDto[]) => {
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
