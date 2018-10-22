import React from "react";
import * as Dtos from "../../models";
import { Link, Renderers, TypedTable } from "..";
import { ClaimDetailsValidator } from "../../validators/claimDtoValidator";

interface Props {
    project: Dtos.ProjectDto;
    partner: Dtos.PartnerDto;
    costCategories: Dtos.CostCategoryDto[];
    claim: Dtos.ClaimDto;
    claimDetails: Dtos.ClaimDetailsSummaryDto[];
    validation?: ClaimDetailsValidator[];
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

    const CostCategoriesTable = TypedTable<typeof combinedData[0]>();

    return (
        <CostCategoriesTable.Table qa="cost-cat" data={combinedData} footers={renderFooters(props.project, props.partner, props.claimDetails)} validationResult={props.validation}>
            <CostCategoriesTable.Custom
                header="Costs category"
                qa="category"
                cellClassName={x => x.isTotal ? "govuk-!-font-weight-bold" : null}
                value={(x,i) => renderCostCategory(x.category, props.getLink, props.validation && props.validation[i.row])}
            />
            <CostCategoriesTable.Currency header="Grant offer letter costs" qa="offerCosts" value={x => x.cost.offerCosts} />
            <CostCategoriesTable.Currency header="Costs claimed to date" qa="claimedToDate" value={x => x.cost.costsClaimedToDate} />
            <CostCategoriesTable.Currency header="Costs this period" qa="periodCosts" value={x => x.cost.costsClaimedThisPeriod} cellClassName={x => x.isTotal ? "govuk-!-font-weight-bold" : null} />
            <CostCategoriesTable.Currency header="Remaining grant offer letter costs" qa="remainingCosts" value={x => x.cost.remainingOfferCosts} />
        </CostCategoriesTable.Table>
    );
};

const renderCostCategory = (category: Dtos.CostCategoryDto, getLink: (costCategoryId: string) => ILinkInfo, validation?: ClaimDetailsValidator) => {
    if(category.isCalculated) {
        return category.name;
    }
    const validationError = validation && validation.errors[0];
    const id = validationError && validationError.key;
    return (
        <Link id={id} route={getLink(category.id)}>{category.name}</Link>
    );
};

const  renderFooters = (project: Dtos.ProjectDto, partner: Dtos.PartnerDto, claimsCosts: Dtos.ClaimDetailsSummaryDto[]) => {
    return [
      (
        <tr key="1" className="govuk-table__row">
            <td className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold" colSpan={3}>Award offer rate</td>
            <td className="govuk-table__cell govuk-table__cell--numeric"><Renderers.Percentage fractionDigits={0} value={partner.awardRate} /></td>
            <td className="govuk-table__cell" />
        </tr>
      ),
      (
        <tr key="2" className="govuk-table__row">
            <td className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold" colSpan={3}>Costs to be paid this quarter</td>
            <td className="govuk-table__cell govuk-table__cell--numeric"><Renderers.Currency value={claimsCosts.reduce((total, item) => total + item.costsClaimedThisPeriod, 0) * partner.awardRate / 100} /></td>
            <td className="govuk-table__cell" />
        </tr>
      )
    ];
};
