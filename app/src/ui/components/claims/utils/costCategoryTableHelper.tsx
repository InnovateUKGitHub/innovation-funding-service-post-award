import React from "react";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { CostCategoryType } from "@framework/entities";
import { ClaimDto, PartnerDto, ProjectDto } from "@framework/types";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { CostsSummaryForPeriodValidator } from "@ui/validators";
import { Link } from "../../links";

export interface ClaimProps {
  project: ProjectDto;
  partner: PartnerDto;
  costCategories: CostCategoryDto[];
  claim: ClaimDto;
  claimDetails: CostsSummaryForPeriodDto[];
  validation?: CostsSummaryForPeriodValidator[];
  getLink: (costCategoryId: string) => ILinkInfo | null;
  standardOverheadRate: number;
}

export function createTableData(props: ClaimProps) {
  const combinedData = props.costCategories
    .filter(
      (x) =>
        x.competitionType === props.project.competitionType &&
        x.organisationType === props.partner.organisationType
    )
    .map((x) => ({
      category: x,
      cost:
        props.claimDetails.find((y) => y.costCategoryId === x.id) ||
        ({} as CostsSummaryForPeriodDto),
      isTotal: false,
    }));

  const initialCategoryTotals = {
    costCategoryId: "",
    offerTotal: 0,
    forecastThisPeriod: 0,
    costsClaimedToDate: 0,
    costsClaimedThisPeriod: 0,
    remainingOfferCosts: 0
  };

  const totalRowCosts = props.claimDetails.reduce((catTotal, item) => {
    return {
      costCategoryId: "",
      offerTotal: catTotal.offerTotal + item.offerTotal,
      forecastThisPeriod: catTotal.forecastThisPeriod + item.forecastThisPeriod,
      costsClaimedToDate: catTotal.costsClaimedToDate + item.costsClaimedToDate,
      costsClaimedThisPeriod: catTotal.costsClaimedThisPeriod + item.costsClaimedThisPeriod,
      remainingOfferCosts: catTotal.remainingOfferCosts + item.remainingOfferCosts,
    };
  }, initialCategoryTotals);

  combinedData.push({
    category: {
      name: "Total",
      type: CostCategoryType.Unknown,
      id: "",
      isCalculated: false,
      hasRelated: false,
      competitionType: "Unknown",
      organisationType: "Unknown",
      description: "",
      hintText: "",
    },
    cost: totalRowCosts,
    isTotal: true,
  });
  return combinedData;
}

export function renderCostCategory(
  claimProps: ClaimProps,
  category: CostCategoryDto,
  row: number
) {
  const { getLink, validation } = claimProps;
  const route = getLink(category.id);

  if (!route) return category.name;

  const linkId = validation && validation[row] && validation[row].errors[0] && validation[row].errors[0].key;

  return (
    <Link id={linkId} route={route}>
      {category.name}
    </Link>
  );
}
