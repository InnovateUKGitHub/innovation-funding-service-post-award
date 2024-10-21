import {
  CategoryInfoProps,
  ClaimInfoProps,
  ClaimTableProps,
  createTableData,
  renderCostCategory,
} from "@ui/components/organisms/claims/utils/costCategoryTableHelper";
import {
  createClaimDetails,
  createClaimLink,
  createCostCategories,
  createPartnerDto,
  createProjectDto,
} from "@framework/util/stubDtos";
import { PCROrganisationType } from "@framework/constants/pcrConstants";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { Result } from "@ui/validation/result";
import { Link } from "@ui/components/atoms/Links/links";

const stubProject = createProjectDto();
const stubPartner = createPartnerDto();
const stubCostCategories = createCostCategories();
const stubClaimDetails = createClaimDetails();

beforeEach(jest.clearAllMocks);

const stubLink = createClaimLink();

describe("createTableData()", () => {
  const defaultStubData: ClaimTableProps = {
    project: {
      ...stubProject,
      competitionType: "CR&D",
    },
    partner: {
      ...stubPartner,
      organisationType: PCROrganisationType.Industrial,
    },
    costCategories: stubCostCategories,
    claimDetails: stubClaimDetails,
    getLink: stubLink,
    caption: "stub-caption",
  };

  describe("returns items with empty data", () => {
    test("when costCategory has no matching claimDetail", () => {
      const stubData: ClaimTableProps = {
        ...defaultStubData,
        project: {
          ...defaultStubData.project,
          competitionType: "CR&D",
        },
        partner: {
          ...defaultStubData.partner,
          organisationType: PCROrganisationType.Industrial,
        },
        costCategories: [
          {
            id: "should-not-find-a-claim-detail" as CostCategoryId,
            name: "Directly incurred - Other costs",
            competitionType: "CR&D",
            organisationType: PCROrganisationType.Industrial,
          },
        ],
        claimDetails: [],
      };
      const { costCategories, totalNegativeCategories } = createTableData(stubData);

      const lastCostCategory = costCategories.length - 1;
      const lineItems = costCategories.slice(0, lastCostCategory);

      expect(lineItems.length).toBe(1);
      expect(totalNegativeCategories.length).toBe(0);
    });

    test("with no matching costCategory", () => {
      const stubData: ClaimTableProps = {
        ...defaultStubData,
        costCategories: [
          {
            id: "does-not-match-a-claim-detail" as CostCategoryId,
            name: "Directly incurred - Other costs",
            competitionType: "CR&D",
            organisationType: PCROrganisationType.Industrial,
          },
        ],
        claimDetails: [
          {
            costCategoryId: "sorry-bro-i-match-nobody" as CostCategoryId,
            offerTotal: 30000,
            forecastThisPeriod: 10000,
            costsClaimedToDate: 3000,
            costsClaimedThisPeriod: 3000,
            remainingOfferCosts: 24000,
          },
        ],
      };
      const { costCategories, totalNegativeCategories } = createTableData(stubData);

      const lastCostCategory = costCategories.length - 1;
      const lineItems = costCategories.slice(0, lastCostCategory);

      expect(lineItems.length).toBe(1);
      expect(totalNegativeCategories.length).toBe(0);
    });

    test("with no matching competitionType", () => {
      const stubData: ClaimTableProps = {
        ...defaultStubData,
        project: {
          ...defaultStubData.project,
          competitionType: "sorry-bro-i-match-nobody",
        },
        costCategories: [
          {
            id: "a060C000000dxWtQAI" as CostCategoryId,
            name: "Labour",
            competitionType: "CR&D",
            organisationType: PCROrganisationType.Industrial,
          },
        ],
        claimDetails: [
          {
            costCategoryId: "a060C000000dxWtQAI" as CostCategoryId,
            offerTotal: 30000,
            forecastThisPeriod: 10000,
            costsClaimedToDate: 5000,
            costsClaimedThisPeriod: 3500,
            remainingOfferCosts: 21500,
          },
        ],
      };
      const { costCategories, totalNegativeCategories } = createTableData(stubData);

      const lastCostCategory = costCategories.length - 1;
      const lineItems = costCategories.slice(0, lastCostCategory);

      expect(lineItems.length).toBe(0);
      expect(totalNegativeCategories.length).toBe(0);
    });

    test("with no matching organisationType", () => {
      const stubData: ClaimTableProps = {
        ...defaultStubData,
        partner: {
          ...defaultStubData.partner,
          organisationType: "sorry-bro-i-match-nobody",
        },
        costCategories: [
          {
            id: "a060C000000dxWtQAI" as CostCategoryId,
            name: "Labour",
            competitionType: "CR&D",
            organisationType: PCROrganisationType.Industrial,
          },
        ],
        claimDetails: [
          {
            costCategoryId: "a060C000000dxWtQAI" as CostCategoryId,
            offerTotal: 30000,
            forecastThisPeriod: 10000,
            costsClaimedToDate: 5000,
            costsClaimedThisPeriod: 3500,
            remainingOfferCosts: 21500,
          },
        ],
      };
      const { costCategories, totalNegativeCategories } = createTableData(stubData);

      const lastCostCategory = costCategories.length - 1;
      const lineItems = costCategories.slice(0, lastCostCategory);

      expect(lineItems.length).toBe(0);
      expect(totalNegativeCategories.length).toBe(0);
    });

    test("with no matching organisationType or competitionType", () => {
      const stubData: ClaimTableProps = {
        ...defaultStubData,
        partner: {
          ...defaultStubData.partner,
          organisationType: "sorry-bro-i-match-nobody-🤷🏻‍♂️",
        },
        project: {
          ...defaultStubData.project,
          competitionType: "sorry-bro-i-match-nobody-😫",
        },
        costCategories: [
          {
            id: "a060C000000dxWtQAI" as CostCategoryId,
            name: "Labour",
            competitionType: "CR&D",
            organisationType: PCROrganisationType.Industrial,
          },
        ],
        claimDetails: [
          {
            costCategoryId: "a060C000000dxWtQAI" as CostCategoryId,
            offerTotal: 30000,
            forecastThisPeriod: 10000,
            costsClaimedToDate: 5000,
            costsClaimedThisPeriod: 3500,
            remainingOfferCosts: 21500,
          },
        ],
      };
      const { costCategories, totalNegativeCategories } = createTableData(stubData);

      const lastCostCategory = costCategories.length - 1;
      const lineItems = costCategories.slice(0, lastCostCategory);

      expect(lineItems.length).toBe(0);
      expect(totalNegativeCategories.length).toBe(0);
    });
  });

  describe("returns correct array length", () => {
    test("returns single line item", () => {
      const stubData: ClaimTableProps = {
        ...defaultStubData,
        costCategories: [
          {
            id: "a060C000000dxWtQAI" as CostCategoryId,
            name: "Labour",
            competitionType: "CR&D",
            organisationType: PCROrganisationType.Industrial,
          },
        ],
        claimDetails: [
          {
            costCategoryId: "a060C000000dxWtQAI" as CostCategoryId,
            offerTotal: 30000,
            forecastThisPeriod: 10000,
            costsClaimedToDate: 5000,
            costsClaimedThisPeriod: 3500,
            remainingOfferCosts: 21500,
          },
        ],
      };
      const { costCategories, totalNegativeCategories } = createTableData(stubData);

      const lineItems = costCategories.slice(0, costCategories.length - 1);

      expect(lineItems.length).toBe(1);
      expect(totalNegativeCategories.length).toBe(0);
    });

    test("returns multiple line items", () => {
      const stubData: ClaimTableProps = {
        ...defaultStubData,
        costCategories: [
          {
            id: "a060C000000dxWtQAI" as CostCategoryId,
            name: "Labour",
            competitionType: "CR&D",
            organisationType: PCROrganisationType.Industrial,
          },
          {
            id: "a060C000000dxWuQAI" as CostCategoryId,
            name: "Overheads",
            competitionType: "CR&D",
            organisationType: PCROrganisationType.Industrial,
          },
        ],
        claimDetails: [
          {
            costCategoryId: "a060C000000dxWtQAI" as CostCategoryId,
            offerTotal: 30000,
            forecastThisPeriod: 10000,
            costsClaimedToDate: 5000,
            costsClaimedThisPeriod: 3500,
            remainingOfferCosts: 21500,
          },
          {
            costCategoryId: "a060C000000dxWuQAI" as CostCategoryId,
            offerTotal: 6000,
            forecastThisPeriod: 2000,
            costsClaimedToDate: 1000,
            costsClaimedThisPeriod: 700,
            remainingOfferCosts: 4300,
          },
        ],
      };
      const { costCategories } = createTableData(stubData);

      const lastCostCategory = costCategories.length - 1;
      const lineItems = costCategories.slice(0, lastCostCategory);

      expect(lineItems.length).toBe(2);
    });

    test("returns total row when matching items are found", () => {
      const stubData: ClaimTableProps = {
        ...defaultStubData,
        costCategories: [],
        claimDetails: [],
      };
      const { costCategories, totalNegativeCategories } = createTableData(stubData);

      expect(costCategories.length).toBe(1);
      expect(costCategories[0].isTotal).toBe(true);
      expect(totalNegativeCategories.length).toBe(0);
    });

    describe("totalNegativeCategories", () => {
      test("returns with single category when remainingOfferCosts is negative", () => {
        const stubData: ClaimTableProps = {
          ...defaultStubData,
          costCategories: [
            {
              id: "a060C000000dxWuQAI" as CostCategoryId,
              name: "Overheads",
              competitionType: "CR&D",
              organisationType: PCROrganisationType.Industrial,
            },
          ],
          claimDetails: [
            {
              costCategoryId: "a060C000000dxWuQAI" as CostCategoryId,
              offerTotal: 6000,
              forecastThisPeriod: 2000,
              costsClaimedToDate: 1000,
              costsClaimedThisPeriod: 700,
              remainingOfferCosts: -1,
            },
          ],
        };
        const { costCategories, totalNegativeCategories } = createTableData(stubData);

        const lastCostCategory = costCategories.length - 1;
        const lineItems = costCategories.slice(0, lastCostCategory);

        expect(lineItems.length).toBe(1);
        expect(totalNegativeCategories.length).toBe(1);
      });

      test("returns with multiple categories when all have negative remainingOfferCosts", () => {
        const stubData: ClaimTableProps = {
          ...defaultStubData,
          costCategories: [
            {
              id: "a060C000000dxWtQAI" as CostCategoryId,
              name: "Labour",
              competitionType: "CR&D",
              organisationType: PCROrganisationType.Industrial,
            },
            {
              id: "a060C000000dxWuQAI" as CostCategoryId,
              name: "Overheads",
              competitionType: "CR&D",
              organisationType: PCROrganisationType.Industrial,
            },
          ],
          claimDetails: [
            {
              costCategoryId: "a060C000000dxWtQAI" as CostCategoryId,
              offerTotal: 30000,
              forecastThisPeriod: 10000,
              costsClaimedToDate: 5000,
              costsClaimedThisPeriod: 3500,
              remainingOfferCosts: -100,
            },
            {
              costCategoryId: "a060C000000dxWuQAI" as CostCategoryId,
              offerTotal: 6000,
              forecastThisPeriod: 2000,
              costsClaimedToDate: 1000,
              costsClaimedThisPeriod: 700,
              remainingOfferCosts: -200,
            },
          ],
        };

        const { costCategories, totalNegativeCategories } = createTableData(stubData);

        const lastCostCategory = costCategories.length - 1;
        const lineItems = costCategories.slice(0, lastCostCategory);

        expect(lineItems.length).toBe(2);
        expect(totalNegativeCategories.length).toBe(2);
      });

      test("returns empty when remainingOfferCosts is positive", () => {
        const stubData: ClaimTableProps = {
          ...defaultStubData,
          costCategories: [
            {
              id: "a060C000000dxWwQAI" as CostCategoryId,
              name: "Capital usage",
              competitionType: "CR&D",
              organisationType: PCROrganisationType.Industrial,
            },
          ],
          claimDetails: [
            {
              costCategoryId: "a060C000000dxWwQAI" as CostCategoryId,
              offerTotal: 30000,
              forecastThisPeriod: 10000,
              costsClaimedToDate: 8000,
              costsClaimedThisPeriod: 8000,
              remainingOfferCosts: 14000,
            },
          ],
        };
        const { totalNegativeCategories } = createTableData(stubData);

        expect(totalNegativeCategories.length).toBe(0);
      });
    });
  });

  describe("validate values", () => {
    test("with one valid cost category", () => {
      const stubData: ClaimTableProps = {
        ...defaultStubData,
        costCategories: [
          {
            id: "a060C000000dxWtQAI" as CostCategoryId,
            name: "Labour",
            competitionType: "CR&D",
            organisationType: PCROrganisationType.Industrial,
          },
        ],
        claimDetails: [
          {
            costCategoryId: "a060C000000dxWtQAI" as CostCategoryId,
            offerTotal: 30000,
            forecastThisPeriod: 10000,
            costsClaimedToDate: 5000,
            costsClaimedThisPeriod: 3500,
            remainingOfferCosts: 21500,
          },
        ],
      };
      const { costCategories } = createTableData(stubData);

      const [firstLineItem] = costCategories;

      // Note: asserting on typeof - must be a string or element
      expect(typeof firstLineItem.label).toBe("object");
      expect(firstLineItem.isTotal).toBe(false);
      expect(firstLineItem.differenceInPounds).toBe(6500);
      expect(firstLineItem.diffPercentage).toBe(-65);
      expect(firstLineItem.category).toStrictEqual(stubData.costCategories[0]);
      expect(firstLineItem.cost).toStrictEqual(stubData.claimDetails[0]);
    });

    test("with two cost categories 1 valid 1 with no matching claim details", () => {
      const stubData: ClaimTableProps = {
        ...defaultStubData,
        costCategories: [
          {
            id: "a060C000000dxWtQAI" as CostCategoryId,
            name: "Labour",
            competitionType: "CR&D",
            organisationType: PCROrganisationType.Industrial,
          },
          {
            id: "a060C000000dxWwQAI" as CostCategoryId,
            name: "Capital usage",
            competitionType: "CR&D",
            organisationType: PCROrganisationType.Industrial,
          },
        ],
        claimDetails: [
          {
            costCategoryId: "a060C000000dxWtQAI" as CostCategoryId,
            offerTotal: 30000,
            forecastThisPeriod: 10000,
            costsClaimedToDate: 5000,
            costsClaimedThisPeriod: 3500,
            remainingOfferCosts: 21500,
          },
        ],
      };
      const { costCategories } = createTableData(stubData);

      const lastCostCategory = costCategories.length - 1;
      const lineItems = costCategories.slice(0, lastCostCategory);

      expect(lineItems).toHaveLength(2);

      const [row1, row2] = lineItems;

      expect(typeof row1.label).toBe("object");
      expect(row1.isTotal).toBe(false);
      expect(row1.differenceInPounds).toBe(6500);
      expect(row1.diffPercentage).toBe(-65);
      expect(row1.category).toStrictEqual(stubData.costCategories[0]);
      expect(row1.cost).toStrictEqual(stubData.claimDetails[0]);

      // Note: this should return an empty row data as not claim watch matched
      expect(typeof row2.label).toBe("object");
      expect(row2.isTotal).toBe(false);
      expect(row2.differenceInPounds).toBe(0);
      expect(row2.diffPercentage).toBe(0);
      expect(row2.category).toStrictEqual(stubData.costCategories[1]);
      expect(row2.cost).toStrictEqual({
        costCategoryId: "",
        costsClaimedThisPeriod: 0,
        costsClaimedToDate: 0,
        forecastThisPeriod: 0,
        offerTotal: 0,
        remainingOfferCosts: 0,
      });
    });

    test("with the total row values", () => {
      const stubData: ClaimTableProps = {
        ...defaultStubData,
        costCategories: [
          {
            id: "a060C000000dxWtQAI" as CostCategoryId,
            name: "Labour",
            competitionType: "CR&D",
            organisationType: PCROrganisationType.Industrial,
          },
          {
            id: "a060C000000dxWuQAI" as CostCategoryId,
            name: "Overheads",
            competitionType: "CR&D",
            organisationType: PCROrganisationType.Industrial,
          },
        ],
        claimDetails: [
          {
            costCategoryId: "a060C000000dxWtQAI" as CostCategoryId,
            offerTotal: 30000,
            forecastThisPeriod: 10000,
            costsClaimedToDate: 5000,
            costsClaimedThisPeriod: 3500,
            remainingOfferCosts: 21500,
          },
          {
            costCategoryId: "a060C000000dxWuQAI" as CostCategoryId,
            offerTotal: 6000,
            forecastThisPeriod: 2000,
            costsClaimedToDate: 1000,
            costsClaimedThisPeriod: 700,
            remainingOfferCosts: 4300,
          },
        ],
      };
      const { costCategories } = createTableData(stubData);

      const totalRow = costCategories[costCategories.length - 1];

      expect(totalRow.label).toBe("Total");
      expect(totalRow.differenceInPounds).toBe(7800);
      expect(totalRow.diffPercentage).toBe(-65);
      expect(totalRow.cost.offerTotal).toBe(36000);
      expect(totalRow.cost.costsClaimedToDate).toBe(6000);
      expect(totalRow.cost.forecastThisPeriod).toBe(12000);
      expect(totalRow.cost.costsClaimedThisPeriod).toBe(4200);
      expect(totalRow.cost.remainingOfferCosts).toBe(25800);
    });
  });
});

describe("renderCostCategory()", () => {
  const stubGetLink = jest.fn();

  beforeEach(jest.clearAllMocks);

  const setup = (claimProps: ClaimInfoProps, categoryInfo: CategoryInfoProps) => {
    return renderCostCategory(claimProps, categoryInfo);
  };

  test("returns name when no link is available", () => {
    const defaultCostCategory: ClaimInfoProps = {
      validation: undefined,
      getLink: stubGetLink.mockReturnValue(null),
    };
    const stubCategory: CategoryInfoProps = {
      id: "stub-id" as CostCategoryId,
      name: "stub-name",
    };

    const categoryNameAsString = setup(defaultCostCategory, stubCategory);

    expect(categoryNameAsString).toBe(stubCategory.name);
  });

  test("returns link when route is available", () => {
    const stubRoute: ILinkInfo = {
      path: "stub-path",
      routeName: "stub-routeName",
      routeParams: {},
      accessControl: () => false,
    };
    const defaultCostCategory: ClaimInfoProps = {
      validation: undefined,
      getLink: stubGetLink.mockReturnValue(stubRoute),
    };
    const stubCategory: CategoryInfoProps = {
      id: "stub-id" as CostCategoryId,
      name: "stub-name",
    };

    const categoryNameAsString = setup(defaultCostCategory, stubCategory);
    const expectedLink = (
      <Link id="" route={stubRoute}>
        {stubCategory.name}
      </Link>
    );

    expect(categoryNameAsString).toStrictEqual(expectedLink);
  });

  test("returns link with a defined validation errorMessage", () => {
    const stubRoute: ILinkInfo = {
      path: "stub-path",
      routeName: "stub-routeName",
      routeParams: {},
      accessControl: () => false,
    };
    const defaultCostCategory: ClaimInfoProps = {
      validation: new Result(null, false, false, "stub-errorMessage", false),
      getLink: stubGetLink.mockReturnValue(stubRoute),
    };
    const stubCategory: CategoryInfoProps = {
      id: "stub-id" as CostCategoryId,
      name: "stub-name",
    };

    const categoryNameAsString = setup(defaultCostCategory, stubCategory);
    const expectedLink = (
      <Link id="Val:0" route={stubRoute}>
        {stubCategory.name}
      </Link>
    );

    expect(categoryNameAsString).toStrictEqual(expectedLink);
  });
});
