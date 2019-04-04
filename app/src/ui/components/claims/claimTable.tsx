import React from "react";
import { Link, Renderers, TypedTable } from "..";
import { ClaimDetailsValidator } from "../../validators/claimDtoValidator";
import { ClaimDto, PartnerDto, ProjectDto } from "../../../types";
import { ILinkInfo } from "../../../types/ILinkInfo";

interface Props {
    project: ProjectDto;
    partner: PartnerDto;
    costCategories: CostCategoryDto[];
    claim: ClaimDto;
    claimDetails: ClaimDetailsSummaryDto[];
    validation?: ClaimDetailsValidator[];
    getLink: (costCategoryId: string) => ILinkInfo;
}

export const ClaimTable: React.FunctionComponent<Props> = (props) => {

    const combinedData = props.costCategories
      .filter(x => x.competitionType === props.project.competitionType && x.organisationType === props.partner.organisationType)
      .map(x => ({
        category: x,
        cost: props.claimDetails.find(y => y.costCategoryId === x.id) || {} as ClaimDetailsSummaryDto,
        isTotal: false
      }));

    // add total row (dosnt have a cost cat so use 0)
    combinedData.push({
        category: {
            name: "Total",
            id: "",
            isCalculated: true,
            competitionType: "Unknown",
            organisationType: "Unknown",
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
            header="Category"
            qa="category"
            cellClassName={x => x.isTotal ? "govuk-!-font-weight-bold" : null}
            value={(x,i) => renderCostCategory(x.category, props.getLink, props.validation && props.validation[i.row])}
        />
        <CostCategoriesTable.Currency header="Total eligible costs" qa="offerCosts" value={x => x.cost.offerCosts} />
        <CostCategoriesTable.Currency header="Eligible costs claimed to date" qa="claimedToDate" value={x => x.cost.costsClaimedToDate} />
        <CostCategoriesTable.Currency header="Costs claimed this period" qa="periodCosts" value={x => x.cost.costsClaimedThisPeriod} cellClassName={x => x.isTotal ? "govuk-!-font-weight-bold" : null} />
        <CostCategoriesTable.Currency header="Remaining eligible costs" qa="remainingCosts" value={x => x.cost.remainingOfferCosts} />
      </CostCategoriesTable.Table>
    );
};

const renderCostCategory = (category: CostCategoryDto, getLink: (costCategoryId: string) => ILinkInfo, validation?: ClaimDetailsValidator) => {
    if(category.isCalculated) {
        return category.name;
    }
    const validationError = validation && validation.errors[0];
    const id = validationError && validationError.key;
    return (
        <Link id={id} route={getLink(category.id)}>{category.name}</Link>
    );
};

const renderFooters = (project: ProjectDto, partner: PartnerDto, claimsCosts: ClaimDetailsSummaryDto[]) => {
    return [
      (
        <tr key="1" className="govuk-table__row">
          <td className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold" colSpan={3}>Funding level</td>
          <td className="govuk-table__cell govuk-table__cell--numeric"><Renderers.Percentage fractionDigits={0} value={partner.awardRate} /></td>
          <td className="govuk-table__cell" />
        </tr>
      ),
      (
        <tr key="2" className="govuk-table__row">
          <td className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold" colSpan={3}>Costs to be paid this period</td>
          <td className="govuk-table__cell govuk-table__cell--numeric">
            <Renderers.Currency value={claimsCosts.reduce((total, item) => total + item.costsClaimedThisPeriod, 0) * partner.awardRate! / 100} />
          </td>
          <td className="govuk-table__cell" />
        </tr>
      )
    ];
};
