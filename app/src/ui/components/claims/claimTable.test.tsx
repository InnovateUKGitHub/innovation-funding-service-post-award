import { render } from "@testing-library/react";
import { PCROrganisationType } from "@framework/constants";

import {
  createClaim,
  createClaimDetails,
  createClaimLink,
  createCostCategories,
  createPartnerDto,
  createProjectDto,
} from "@framework/util/stubDtos";
import TestBed from "@shared/TestBed";

import { ClaimProps } from "@ui/components/claims/utils/costCategoryTableHelper";
import { getColumnTextValues } from "@tests/test-utils/tableHelpers";

import { ClaimTable } from "@ui/components/claims/claimTable";
import { initStubTestIntl } from "@shared/initStubTestIntl";

describe("<ClaimTable />", () => {
  const defaultStubData: ClaimProps = {
    project: createProjectDto(),
    partner: createPartnerDto(),
    costCategories: createCostCategories(),
    claim: createClaim(),
    claimDetails: createClaimDetails(),
    getLink: createClaimLink(),
  };

  const stubContent = {
    pages: {
      claimsComponents: {
        negativeCategoriesMessage: {
          before: "stub-negativeCategoriesMessage-before",
          after: "stub-negativeCategoriesMessage-after",
        },
        categoryLabel: "stub-categoryLabel",
        totalEligibleCosts: "stub-totalEligibleCosts",
        eligibleCostsClaimedToDate: "stub-eligibleCostsClaimedToDate",
        costsClaimedThisPeriod: "stub-costsClaimedThisPeriod",
        remainingEligibleCosts: "stub-remainingEligibleCosts",
      },
    },
  };

  const setup = (props?: Partial<ClaimProps>) => {
    return render(
      <TestBed>
        <ClaimTable {...defaultStubData} {...props} />
      </TestBed>,
    );
  };

  beforeAll(async () => {
    await initStubTestIntl(stubContent);
  });

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
              organisationType: PCROrganisationType.Industrial,
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
              organisationType: PCROrganisationType.Industrial,
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
              organisationType: PCROrganisationType.Industrial,
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
              organisationType: PCROrganisationType.Industrial,
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
              organisationType: PCROrganisationType.Industrial,
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
              organisationType: PCROrganisationType.Industrial,
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

        const negativeContent = stubContent.pages.claimsComponents.negativeCategoriesMessage;

        const negativeWarningFirstParagraph = queryByText(negativeContent.before);
        const negativeWarningLastParagraph = queryByText(negativeContent.after);

        expect(negativeWarningFirstParagraph).toBeInTheDocument();
        expect(negativeWarningLastParagraph).toBeInTheDocument();
      });
    });
  });
});
