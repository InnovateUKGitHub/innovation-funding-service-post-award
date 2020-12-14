// tslint:disable: no-identical-functions no-big-function no-duplicate-string

import React from "react";
import { render } from "@testing-library/react";

import {
  createClaim,
  createClaimDetails,
  createClaimLink,
  createCostCategories,
  createPartnerDto,
  createProjectDto,
} from "@framework/util/stubDtos";
import TestBed, { TestBedContent } from "@shared/TestBed";

import { getColumnTextValues } from "../helpers/tableHelpers";

import { ClaimTable } from "../../../src/ui/components/claims/claimTable";
import { ClaimProps } from "@ui/components/claims/utils/costCategoryTableHelper";

describe("<ClaimTable />", () => {
  const defaultStubData: ClaimProps = {
    project: createProjectDto(),
    partner: createPartnerDto(),
    costCategories: createCostCategories(),
    claim: createClaim(),
    claimDetails: createClaimDetails(),
    getLink: createClaimLink(),
    standardOverheadRate: 20,
  };

  const stubContent = {
    claimsComponents: {
      negativeCategoriesMessage: {
        before: { content: "stub-negativeCategoriesMessage-before" },
        after: { content: "stub-negativeCategoriesMessage-after" },
      },
      categoryLabel: { content: "stub-categoryLabel" },
      totalEligibleCosts: { content: "stub-totalEligibleCosts" },
      eligibleCostsClaimedToDate: { content: "stub-eligibleCostsClaimedToDate" },
      costsClaimedThisPeriod: { content: "stub-costsClaimedThisPeriod" },
      remainingEligibleCosts: { content: "stub-remainingEligibleCosts" },
    },
  };

  const setup = (props?: Partial<ClaimProps>) =>
    render(
      <TestBed content={stubContent as TestBedContent}>
        <ClaimTable {...defaultStubData} {...props} />
      </TestBed>,
    );

  describe("@renders", () => {
    describe("with data in correct order", () => {
      test.each`
        name                  | rowIndex | expectedValues
        ${"with first line"}  | ${0}     | ${["Labour", "£30,000.00", "£5,000.00", "£3,500.00", "£21,500.00"]}
        ${"with second line"} | ${1}     | ${["Overheads", "£6,000.00", "£1,000.00", "£700.00", "£4,300.00"]}
      `("$name", ({ rowIndex, expectedValues }) => {
        const multipleLineItems: ClaimProps = {
          ...defaultStubData,
          costCategories: [
            {
              id: "a060C000000dxWtQAI",
              name: "Labour",
              type: 10,
              competitionType: "CR&D",
              organisationType: "Industrial",
              isCalculated: false,
              hasRelated: false,
              description: "Labour costs for industrial organisations",
              hintText: "stub-hintText",
            },
            {
              id: "a060C000000dxWuQAI",
              name: "Overheads",
              type: 20,
              competitionType: "CR&D",
              organisationType: "Industrial",
              isCalculated: false,
              hasRelated: false,
              description: "Overhead costs - a % of Labour costs for industrial organisations",
              hintText: "stub-hintText",
            },
          ],
          claimDetails: [
            {
              costCategoryId: "a060C000000dxWtQAI",
              offerTotal: 30000,
              forecastThisPeriod: 10000,
              costsClaimedToDate: 5000,
              costsClaimedThisPeriod: 3500,
              remainingOfferCosts: 21500,
            },
            {
              costCategoryId: "a060C000000dxWuQAI",
              offerTotal: 6000,
              forecastThisPeriod: 2000,
              costsClaimedToDate: 1000,
              costsClaimedThisPeriod: 700,
              remainingOfferCosts: 4300,
            },
          ],
        };
        const { container } = setup(multipleLineItems);

        const columnValues = getColumnTextValues(container, "cost-cat", rowIndex);

        expect(columnValues).toStrictEqual(expectedValues);
      });
    });

    describe("with conditional ui", () => {
      test("with error ui when total remaining costs is less than 0", () => {
        const errorClaim: ClaimProps = {
          ...defaultStubData,
          costCategories: [
            {
              id: "a060C000000dxWtQAI",
              name: "Labour",
              type: 10,
              competitionType: "CR&D",
              organisationType: "Industrial",
              isCalculated: false,
              hasRelated: false,
              description: "Labour costs for industrial organisations",
              hintText: "stub-hintText",
            },
            {
              id: "a060C000000dxWuQAI",
              name: "Overheads",
              type: 20,
              competitionType: "CR&D",
              organisationType: "Industrial",
              isCalculated: false,
              hasRelated: false,
              description: "Overhead costs - a % of Labour costs for industrial organisations",
              hintText: "stub-hintText",
            },
          ],
          claimDetails: [
            {
              costCategoryId: "a060C000000dxWtQAI",
              offerTotal: 30000,
              forecastThisPeriod: 10000,
              costsClaimedToDate: 5000,
              costsClaimedThisPeriod: 3500,
              remainingOfferCosts: 21500,
            },
            {
              costCategoryId: "a060C000000dxWuQAI",
              offerTotal: 6000,
              forecastThisPeriod: 2000,
              costsClaimedToDate: 1000,
              costsClaimedThisPeriod: 700,
              remainingOfferCosts: -200000,
            },
          ],
        };
        const { container } = setup(errorClaim);

        const errorTotalRowError = container.querySelector(".table__row--error");
        const errorTotalCells = container.querySelectorAll(".claim-table-cell--error");

        expect(errorTotalRowError).toBeInTheDocument();
        expect(errorTotalCells.length).toBe(2);
      });

      test("with warning message when a single line item is less than zero", () => {
        const warningClaim: ClaimProps = {
          ...defaultStubData,
          costCategories: [
            {
              id: "a060C000000dxWtQAI",
              name: "Labour",
              type: 10,
              competitionType: "CR&D",
              organisationType: "Industrial",
              isCalculated: false,
              hasRelated: false,
              description: "Labour costs for industrial organisations",
              hintText: "stub-hintText",
            },
            {
              id: "a060C000000dxWuQAI",
              name: "Overheads",
              type: 20,
              competitionType: "CR&D",
              organisationType: "Industrial",
              isCalculated: false,
              hasRelated: false,
              description: "Overhead costs - a % of Labour costs for industrial organisations",
              hintText: "stub-hintText",
            },
          ],
          claimDetails: [
            {
              costCategoryId: "a060C000000dxWtQAI",
              offerTotal: 30000,
              forecastThisPeriod: 10000,
              costsClaimedToDate: 5000,
              costsClaimedThisPeriod: 3500,
              remainingOfferCosts: 21500,
            },
            {
              costCategoryId: "a060C000000dxWuQAI",
              offerTotal: 6000,
              forecastThisPeriod: 2000,
              costsClaimedToDate: 1000,
              costsClaimedThisPeriod: 700,
              remainingOfferCosts: -1,
            },
          ],
        };
        const { queryByText } = setup(warningClaim);

        const negativeContent = stubContent.claimsComponents.negativeCategoriesMessage;

        const negativeWarningFirstParagraph = queryByText(negativeContent.before.content);
        const negativeWarningLastParagraph = queryByText(negativeContent.after.content);

        expect(negativeWarningFirstParagraph).toBeInTheDocument();
        expect(negativeWarningLastParagraph).toBeInTheDocument();
      });
    });
  });
});
