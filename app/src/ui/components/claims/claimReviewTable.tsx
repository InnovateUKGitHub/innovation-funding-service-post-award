import React from "react";
import { ClaimDto, PartnerDto, ProjectDto } from "@framework/types";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { CostsSummaryForPeriodValidator } from "@ui/validators";
import { TypedTable } from "../table";
import { Link } from "../links";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { CostCategoryType } from "@framework/entities";

interface Props {
  project: ProjectDto;
  partner: PartnerDto;
  costCategories: CostCategoryDto[];
  claim: ClaimDto;
  claimDetails: CostsSummaryForPeriodDto[];
  validation?: CostsSummaryForPeriodValidator[];
  getLink: (costCategoryId: string) => ILinkInfo | null;
  standardOverheadRate: number;
}

export const ClaimReviewTable: React.FunctionComponent<Props> = (props) => {

  const combinedData = props.costCategories
    .filter(x => x.competitionType === props.project.competitionType && x.organisationType === props.partner.organisationType)
    .map(x => ({
      category: x,
      cost: props.claimDetails.find(y => y.costCategoryId === x.id) || {} as CostsSummaryForPeriodDto,
      isTotal: false
    }));

  combinedData.push({
    category: {
      name: "Total",
      type: CostCategoryType.Unknown,
      id: "",
      isCalculated: true,
      hasRelated: false,
      competitionType: "Unknown",
      organisationType: "Unknown",
      description: "",
      hintText: ""
    },
    cost: {
      costCategoryId: "",
      forecastThisPeriod: props.claimDetails.reduce((total, item) => total + item.forecastThisPeriod, 0),
      offerTotal: props.claimDetails.reduce((total, item) => total + item.offerTotal, 0),
      costsClaimedThisPeriod: props.claimDetails.reduce((total, item) => total + item.costsClaimedThisPeriod, 0),
      remainingOfferCosts: props.claimDetails.reduce((total, item) => total + item.remainingOfferCosts, 0),
      costsClaimedToDate: props.claimDetails.reduce((total, item) => total + item.costsClaimedToDate, 0),
    },
    isTotal: true
  });

  const CostCategoriesTable = TypedTable<typeof combinedData[0]>();

  const diff = (x: typeof combinedData[0]) => x.cost.forecastThisPeriod - x.cost.costsClaimedThisPeriod;
  const diffPercentage = (x: typeof combinedData[0]) => 100 * diff(x) / x.cost.forecastThisPeriod;

  return (
    <CostCategoriesTable.Table
      qa="cost-cat"
      data={combinedData}
      validationResult={props.validation}
    >
      <CostCategoriesTable.Custom
        header="Category"
        qa="category"
        cellClassName={x => x.isTotal ? "govuk-!-font-weight-bold" : null}
        value={(x, i) => renderCostCategory(props.claim, x.category, x.isTotal, props.standardOverheadRate,props.getLink, props.validation && props.validation[i.row])}
      />
      <CostCategoriesTable.Currency header="Forecast for period" qa="forecastForPeriod" value={x => x.cost.forecastThisPeriod}/>
      <CostCategoriesTable.Currency
        header="Costs claimed this period"
        qa="costsThisPeriod"
        value={x => x.cost.costsClaimedThisPeriod}
        cellClassName={x => x.isTotal ? "govuk-!-font-weight-bold" : null}
      />
      <CostCategoriesTable.Currency header="Difference (£)" qa="differencePounds" value={x => diff(x)}/>
      <CostCategoriesTable.Percentage header="Difference (%)" qa="differencePercentage" value={x => diffPercentage(x)}/>
    </CostCategoriesTable.Table>
  );
};

const renderCostCategory = (claim: ClaimDto, category: CostCategoryDto, isTotal: boolean, standardOverheadRate: number, getLink: (costCategoryId: string) => ILinkInfo | null, validation?: CostsSummaryForPeriodValidator) => {
  const route = category.id && getLink(category.id);

  if(!route || isTotal || (category.isCalculated && claim.overheadRate <= standardOverheadRate)) {
    return category.name;
  }

  const validationError = validation && validation.errors[0];
  const id = validationError && validationError.key;

  return <Link id={id} route={route}>{category.name}</Link>;
};
