import React from "react";
import { Link, TypedTable } from "..";
import { ClaimDto, ILinkInfo, PartnerDto, ProjectDto } from "@framework/types";
import { CostsSummaryForPeriodValidator } from "@ui/validators";
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

export const ClaimTable: React.FunctionComponent<Props> = (props) => {

  const combinedData = props.costCategories
    .filter(x => x.competitionType === props.project.competitionType && x.organisationType === props.partner.organisationType)
    .map(x => ({
      category: x,
      cost: props.claimDetails.find(y => y.costCategoryId === x.id) || {} as CostsSummaryForPeriodDto,
      isTotal: false
    }));

  // add total row (dosnt have a cost cat so use 0)
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
      remainingOfferCosts: props.claimDetails.reduce((total, item) => total + item.remainingOfferCosts, 0),
      costsClaimedThisPeriod: props.claimDetails.reduce((total, item) => total + item.costsClaimedThisPeriod, 0),
      costsClaimedToDate: props.claimDetails.reduce((total, item) => total + item.costsClaimedToDate, 0),
      offerTotal: props.claimDetails.reduce((total, item) => total + item.offerTotal, 0),
      forecastThisPeriod: props.claimDetails.reduce((total, item) => total + item.forecastThisPeriod, 0),
    },
    isTotal: true
  });

  const CostCategoriesTable = TypedTable<typeof combinedData[0]>();

  return (
    <CostCategoriesTable.Table qa="cost-cat" data={combinedData} validationResult={props.validation}>
      <CostCategoriesTable.Custom
        header="Category"
        qa="category"
        cellClassName={x => x.isTotal ? "govuk-!-font-weight-bold" : null}
        value={(x, i) => renderCostCategory(props.claim, x.category, x.isTotal, props.standardOverheadRate, props.getLink, props.validation && props.validation[i.row])}
      />
      <CostCategoriesTable.Currency header="Total eligible costs" qa="offerCosts" value={x => x.cost.offerTotal} />
      <CostCategoriesTable.Currency header="Eligible costs claimed to date" qa="claimedToDate" value={x => x.cost.costsClaimedToDate} />
      <CostCategoriesTable.Currency header="Costs claimed this period" qa="periodCosts" value={x => x.cost.costsClaimedThisPeriod} cellClassName={x => x.isTotal ? "govuk-!-font-weight-bold" : null} />
      <CostCategoriesTable.Currency header="Remaining eligible costs" qa="remainingCosts" value={x => x.cost.remainingOfferCosts} />
    </CostCategoriesTable.Table>
  );
};

const renderCostCategory = (claim: ClaimDto, category: CostCategoryDto, isTotal: boolean, standardOverheadRate: number, getLink: (costCategoryId: string) => ILinkInfo | null, validation?: CostsSummaryForPeriodValidator) => {
  const route = category.id && getLink(category.id);

  if(!route || isTotal || (category.isCalculated && claim.overheadRate <= standardOverheadRate)) {
    return category.name;
  }

  const id = validation && validation.errors[0] && validation.errors[0].key;

  return <Link id={id} route={route}>{category.name}</Link>;
};
