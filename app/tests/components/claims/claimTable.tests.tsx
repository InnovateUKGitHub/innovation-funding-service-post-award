// tslint:disable:no-identical-functions no-duplicate-string
import { ClaimTable } from "../../../src/ui/components/claims/claimTable";
import "jest";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { DateTime, Settings } from "luxon";
import React from "react";
import { ClaimDto, PartnerDto, ProjectDto } from "@framework/dtos";
import { createDto } from "../helpers/dtoHelpers";
import { getColumnValues, getFooterValue } from "../helpers/tableHelpers";
import { range } from "@shared/range";
import { ILinkInfo } from "@framework/types";

Enzyme.configure({ adapter: new Adapter() });

describe("Claim Table", () => {
  const currencyFormatter = Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", });

  const costsClaimed = [
    7001,
    350.05,
    450,
    777,
    201,
    400,
    0
  ];

  const elegibleCosts = [
    120.3,
    130.6,
    140.9,
    50,
    75,
    121,
    0
  ];

  const claimedToDate = [
    12.3,
    155,
    23.9,
    122,
    154,
    23,
    0
  ];

  const project = createDto<ProjectDto>({ competitionType: "compType" });
  const partner = createDto<PartnerDto>({ awardRate: 90, organisationType: "orgType" });
  const claim = createDto<ClaimDto>({overheadRate: 20});

  const costCategories = costsClaimed.map((x,i) => createDto<CostCategoryDto>({ id: `costcat${i}`, name: `Cost Cat ${i}`, competitionType: project.competitionType, organisationType: partner.organisationType}));
  const claimDetails = costCategories.map((x,i) => createDto<CostsSummaryForPeriodDto>({
    costCategoryId: x.id,
    costsClaimedThisPeriod: costsClaimed[i],
    offerTotal: elegibleCosts[i],
    costsClaimedToDate: claimedToDate[i],
    remainingOfferCosts: elegibleCosts[i] - claimedToDate[i]
  }));
  const getLink = () => null as any;

  it("Displays costs cost catogories", () => {

    const wrapper = Enzyme.mount(<ClaimTable project={project} partner={partner} claim={claim} costCategories={costCategories} claimDetails={claimDetails} getLink={() => (null)} standardOverheadRate={claim.overheadRate} />);

    const expected = costCategories.map(x => x.name);

    // has footer total
    expected.push("Total");

    const claimed = getColumnValues(wrapper, "cost-cat", "col-category").map(x => x.text());
    expect(claimed).toEqual(expected);
  });

  it("Displays Total eligible costs", () => {

    const wrapper = Enzyme.mount(<ClaimTable project={project} partner={partner} claim={claim} costCategories={costCategories} claimDetails={claimDetails} getLink={() => (null)} standardOverheadRate={claim.overheadRate} />);

    const expected = claimDetails.map(x => currencyFormatter.format(x.offerTotal));

    // has footer total
    expected.push(currencyFormatter.format(claimDetails.reduce((total, x) => total + x.offerTotal, 0)));

    const claimed = getColumnValues(wrapper, "cost-cat", "col-offerCosts").map(x => x.text());
    expect(claimed).toEqual(expected);
  });

  it("Displays Eligible costs claimed to date", () => {

    const wrapper = Enzyme.mount(<ClaimTable project={project} partner={partner} claim={claim} costCategories={costCategories} claimDetails={claimDetails} getLink={() => (null)} standardOverheadRate={claim.overheadRate} />);

    const expected = claimDetails.map(x => currencyFormatter.format(x.costsClaimedToDate));

    // has footer total
    expected.push(currencyFormatter.format(claimDetails.reduce((total, x) => total + x.costsClaimedToDate, 0)));

    const claimed = getColumnValues(wrapper, "cost-cat", "col-claimedToDate").map(x => x.text());
    expect(claimed).toEqual(expected);
  });

  it("Displays costs claimed this period", () => {

    const wrapper = Enzyme.mount(<ClaimTable project={project} partner={partner} claim={claim} costCategories={costCategories} claimDetails={claimDetails} getLink={() => (null)} standardOverheadRate={claim.overheadRate} />);

    const expected = claimDetails.map(x => currencyFormatter.format(x.costsClaimedThisPeriod));

    // has footer total
    expected.push(currencyFormatter.format(costsClaimed.reduce((total, x) => total + x, 0)));

    const claimed = getColumnValues(wrapper, "cost-cat", "col-periodCosts").map(x => x.text());
    expect(claimed).toEqual(expected);
  });

  it("Displays Remaining eligible costs", () => {

    const wrapper = Enzyme.mount(<ClaimTable project={project} partner={partner} claim={claim} costCategories={costCategories} claimDetails={claimDetails} getLink={() => (null)} standardOverheadRate={claim.overheadRate} />);

    const expected = claimDetails.map(x => currencyFormatter.format(x.remainingOfferCosts));

    // has footer total
    expected.push(currencyFormatter.format(claimDetails.reduce((total, x) => total + x.remainingOfferCosts, 0)));

    const claimed = getColumnValues(wrapper, "cost-cat", "col-remainingCosts").map(x => x.text());
    expect(claimed).toEqual(expected);
  });

  it("Displays Funding Level", () => {

    const wrapper = Enzyme.mount(<ClaimTable project={project} partner={partner} claim={claim} costCategories={costCategories} claimDetails={claimDetails} getLink={getLink} standardOverheadRate={20} />);
    const total = getFooterValue(wrapper, "cost-cat", 0, 1); // its the footer - 1st row, 2nd col,
    expect(total.text()).toBe("90%");
  });

  it("Displays Costs to be paid", () => {

    const wrapper = Enzyme.mount(<ClaimTable project={project} partner={partner} claim={claim} costCategories={costCategories} claimDetails={claimDetails} getLink={getLink} standardOverheadRate={20} />);
    const total = getFooterValue(wrapper, "cost-cat", 1, 1); // its the footer - 2nd row, 2nd col
    expect(total.text()).toBe("£8,261.15");
  });
});
