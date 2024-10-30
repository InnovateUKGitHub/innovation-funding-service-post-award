import { GetTimeExtensionOptionsQuery } from "@server/features/pcrs/getTimeExtensionOptionsQuery";
import { TestContext } from "@tests/test-utils/testContextProvider";

describe("GetTimeExtensionOptionsQuery", () => {
  beforeAll(() => jest.useFakeTimers());
  afterAll(jest.useRealTimers);

  const setup = <YearMonthValue extends [number, number]>(
    stubYearAndMonth: YearMonthValue,
    expectedYearAndMonth: YearMonthValue,
  ) => {
    const [stubYear, stubMonth] = stubYearAndMonth;
    const [expectedYear, expectedMonth] = expectedYearAndMonth;

    // Note: We remove to match the correct date index (easier for setup params too!)
    const stubMonthIndex = stubMonth - 1;

    jest.setSystemTime(new Date(Date.UTC(stubYear, stubMonthIndex)).getTime());

    const context = new TestContext();
    const project = context.testData.createProject(x => (x.Acc_EndDate__c = `${expectedYear}-${expectedMonth}-01`));

    const query = new GetTimeExtensionOptionsQuery(project.Id);

    return {
      context,
      query,
    };
  };

  describe("with previous, current and future options", () => {
    test("with 1 previous option", async () => {
      const { context, query } = setup([2021, 11], [2021, 12]);

      const results = await context.runQuery(query);

      expect(results.slice(0, 3)).toMatchInlineSnapshot(`
        [
          {
            "label": "November 2021",
            "offset": -1,
          },
          {
            "label": "December 2021",
            "offset": 0,
          },
          {
            "label": "January 2022",
            "offset": 1,
          },
        ]
      `);
    });

    test("with 2 previous options", async () => {
      const { context, query } = setup([2021, 10], [2021, 12]);

      const results = await context.runQuery(query);

      expect(results.slice(0, 4)).toMatchInlineSnapshot(`
        [
          {
            "label": "October 2021",
            "offset": -2,
          },
          {
            "label": "November 2021",
            "offset": -1,
          },
          {
            "label": "December 2021",
            "offset": 0,
          },
          {
            "label": "January 2022",
            "offset": 1,
          },
        ]
      `);
    });

    test("with future options", async () => {
      const { context, query } = setup([2021, 12], [2021, 12]);

      const results = await context.runQuery(query);

      // Note: The test config has 5 years - there is no present way of overriding this
      expect(results).toMatchInlineSnapshot(`
        [
          {
            "label": "December 2021",
            "offset": 0,
          },
          {
            "label": "January 2022",
            "offset": 1,
          },
          {
            "label": "February 2022",
            "offset": 2,
          },
          {
            "label": "March 2022",
            "offset": 3,
          },
          {
            "label": "April 2022",
            "offset": 4,
          },
          {
            "label": "May 2022",
            "offset": 5,
          },
          {
            "label": "June 2022",
            "offset": 6,
          },
          {
            "label": "July 2022",
            "offset": 7,
          },
          {
            "label": "August 2022",
            "offset": 8,
          },
          {
            "label": "September 2022",
            "offset": 9,
          },
          {
            "label": "October 2022",
            "offset": 10,
          },
          {
            "label": "November 2022",
            "offset": 11,
          },
          {
            "label": "December 2022",
            "offset": 12,
          },
          {
            "label": "January 2023",
            "offset": 13,
          },
          {
            "label": "February 2023",
            "offset": 14,
          },
          {
            "label": "March 2023",
            "offset": 15,
          },
          {
            "label": "April 2023",
            "offset": 16,
          },
          {
            "label": "May 2023",
            "offset": 17,
          },
          {
            "label": "June 2023",
            "offset": 18,
          },
          {
            "label": "July 2023",
            "offset": 19,
          },
          {
            "label": "August 2023",
            "offset": 20,
          },
          {
            "label": "September 2023",
            "offset": 21,
          },
          {
            "label": "October 2023",
            "offset": 22,
          },
          {
            "label": "November 2023",
            "offset": 23,
          },
          {
            "label": "December 2023",
            "offset": 24,
          },
          {
            "label": "January 2024",
            "offset": 25,
          },
          {
            "label": "February 2024",
            "offset": 26,
          },
          {
            "label": "March 2024",
            "offset": 27,
          },
          {
            "label": "April 2024",
            "offset": 28,
          },
          {
            "label": "May 2024",
            "offset": 29,
          },
          {
            "label": "June 2024",
            "offset": 30,
          },
          {
            "label": "July 2024",
            "offset": 31,
          },
          {
            "label": "August 2024",
            "offset": 32,
          },
          {
            "label": "September 2024",
            "offset": 33,
          },
          {
            "label": "October 2024",
            "offset": 34,
          },
          {
            "label": "November 2024",
            "offset": 35,
          },
          {
            "label": "December 2024",
            "offset": 36,
          },
          {
            "label": "January 2025",
            "offset": 37,
          },
          {
            "label": "February 2025",
            "offset": 38,
          },
          {
            "label": "March 2025",
            "offset": 39,
          },
          {
            "label": "April 2025",
            "offset": 40,
          },
          {
            "label": "May 2025",
            "offset": 41,
          },
          {
            "label": "June 2025",
            "offset": 42,
          },
          {
            "label": "July 2025",
            "offset": 43,
          },
          {
            "label": "August 2025",
            "offset": 44,
          },
          {
            "label": "September 2025",
            "offset": 45,
          },
          {
            "label": "October 2025",
            "offset": 46,
          },
          {
            "label": "November 2025",
            "offset": 47,
          },
          {
            "label": "December 2025",
            "offset": 48,
          },
          {
            "label": "January 2026",
            "offset": 49,
          },
          {
            "label": "February 2026",
            "offset": 50,
          },
          {
            "label": "March 2026",
            "offset": 51,
          },
          {
            "label": "April 2026",
            "offset": 52,
          },
          {
            "label": "May 2026",
            "offset": 53,
          },
          {
            "label": "June 2026",
            "offset": 54,
          },
          {
            "label": "July 2026",
            "offset": 55,
          },
          {
            "label": "August 2026",
            "offset": 56,
          },
          {
            "label": "September 2026",
            "offset": 57,
          },
          {
            "label": "October 2026",
            "offset": 58,
          },
          {
            "label": "November 2026",
            "offset": 59,
          },
          {
            "label": "December 2026",
            "offset": 60,
          },
        ]
      `);
    });
  });

  describe("with correct offsets", () => {
    describe("with previous options", () => {
      test.each`
        name                   | stubDate      | expectedDate  | previousTotalOffsetOptions
        ${"with no options"}   | ${[2021, 12]} | ${[2021, 12]} | ${0}
        ${"with one option"}   | ${[2021, 11]} | ${[2021, 12]} | ${1}
        ${"with two options"}  | ${[2021, 10]} | ${[2021, 12]} | ${2}
        ${"with many options"} | ${[2020, 2]}  | ${[2021, 12]} | ${22}
      `("returns correct offsets $name", async ({ stubDate, expectedDate, previousTotalOffsetOptions }) => {
        const { context, query } = setup(stubDate, expectedDate);

        const results = await context.runQuery(query);

        const hasNegativeOffset = results.filter(x => x.offset < 0);

        expect(hasNegativeOffset).toHaveLength(previousTotalOffsetOptions);
      });
    });

    describe("with current options", () => {
      test("with only one offset value of 0", async () => {
        const { context, query } = setup([2021, 12], [2021, 12]);

        const results = await context.runQuery(query);

        const findZeroOffset = results.filter(x => x.offset === 0);

        expect(findZeroOffset).toHaveLength(1);
        expect(findZeroOffset[0].label).toBe("December 2021");
      });
    });

    describe("with future options", () => {
      test("with 5 years worth of monthly options", async () => {
        const { context, query } = setup([2021, 12], [2021, 12]);

        const results = await context.runQuery(query);

        const hasNegativeOffset = results.filter(x => x.offset > 0);

        // Note: The test config has 5 years - there is no present way of overriding this
        expect(hasNegativeOffset).toHaveLength(60);
      });
    });
  });
});
