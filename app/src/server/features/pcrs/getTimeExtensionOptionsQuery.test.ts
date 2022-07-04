import { GetTimeExtensionOptionsQuery } from "@server/features/pcrs/getTimeExtensionOptionsQuery";

import { TestContext } from "@tests/test-utils/testContextProvider";

describe("GetTimeExtensionOptionsQuery", () => {
  beforeAll(() => jest.useFakeTimers("modern"));
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
        Array [
          Object {
            "label": "November 2021",
            "offset": -1,
          },
          Object {
            "label": "December 2021",
            "offset": 0,
          },
          Object {
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
        Array [
          Object {
            "label": "October 2021",
            "offset": -2,
          },
          Object {
            "label": "November 2021",
            "offset": -1,
          },
          Object {
            "label": "December 2021",
            "offset": 0,
          },
          Object {
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
        Array [
          Object {
            "label": "December 2021",
            "offset": 0,
          },
          Object {
            "label": "January 2022",
            "offset": 1,
          },
          Object {
            "label": "February 2022",
            "offset": 2,
          },
          Object {
            "label": "March 2022",
            "offset": 3,
          },
          Object {
            "label": "April 2022",
            "offset": 4,
          },
          Object {
            "label": "May 2022",
            "offset": 5,
          },
          Object {
            "label": "June 2022",
            "offset": 6,
          },
          Object {
            "label": "July 2022",
            "offset": 7,
          },
          Object {
            "label": "August 2022",
            "offset": 8,
          },
          Object {
            "label": "September 2022",
            "offset": 9,
          },
          Object {
            "label": "October 2022",
            "offset": 10,
          },
          Object {
            "label": "November 2022",
            "offset": 11,
          },
          Object {
            "label": "December 2022",
            "offset": 12,
          },
          Object {
            "label": "January 2023",
            "offset": 13,
          },
          Object {
            "label": "February 2023",
            "offset": 14,
          },
          Object {
            "label": "March 2023",
            "offset": 15,
          },
          Object {
            "label": "April 2023",
            "offset": 16,
          },
          Object {
            "label": "May 2023",
            "offset": 17,
          },
          Object {
            "label": "June 2023",
            "offset": 18,
          },
          Object {
            "label": "July 2023",
            "offset": 19,
          },
          Object {
            "label": "August 2023",
            "offset": 20,
          },
          Object {
            "label": "September 2023",
            "offset": 21,
          },
          Object {
            "label": "October 2023",
            "offset": 22,
          },
          Object {
            "label": "November 2023",
            "offset": 23,
          },
          Object {
            "label": "December 2023",
            "offset": 24,
          },
          Object {
            "label": "January 2024",
            "offset": 25,
          },
          Object {
            "label": "February 2024",
            "offset": 26,
          },
          Object {
            "label": "March 2024",
            "offset": 27,
          },
          Object {
            "label": "April 2024",
            "offset": 28,
          },
          Object {
            "label": "May 2024",
            "offset": 29,
          },
          Object {
            "label": "June 2024",
            "offset": 30,
          },
          Object {
            "label": "July 2024",
            "offset": 31,
          },
          Object {
            "label": "August 2024",
            "offset": 32,
          },
          Object {
            "label": "September 2024",
            "offset": 33,
          },
          Object {
            "label": "October 2024",
            "offset": 34,
          },
          Object {
            "label": "November 2024",
            "offset": 35,
          },
          Object {
            "label": "December 2024",
            "offset": 36,
          },
          Object {
            "label": "January 2025",
            "offset": 37,
          },
          Object {
            "label": "February 2025",
            "offset": 38,
          },
          Object {
            "label": "March 2025",
            "offset": 39,
          },
          Object {
            "label": "April 2025",
            "offset": 40,
          },
          Object {
            "label": "May 2025",
            "offset": 41,
          },
          Object {
            "label": "June 2025",
            "offset": 42,
          },
          Object {
            "label": "July 2025",
            "offset": 43,
          },
          Object {
            "label": "August 2025",
            "offset": 44,
          },
          Object {
            "label": "September 2025",
            "offset": 45,
          },
          Object {
            "label": "October 2025",
            "offset": 46,
          },
          Object {
            "label": "November 2025",
            "offset": 47,
          },
          Object {
            "label": "December 2025",
            "offset": 48,
          },
          Object {
            "label": "January 2026",
            "offset": 49,
          },
          Object {
            "label": "February 2026",
            "offset": 50,
          },
          Object {
            "label": "March 2026",
            "offset": 51,
          },
          Object {
            "label": "April 2026",
            "offset": 52,
          },
          Object {
            "label": "May 2026",
            "offset": 53,
          },
          Object {
            "label": "June 2026",
            "offset": 54,
          },
          Object {
            "label": "July 2026",
            "offset": 55,
          },
          Object {
            "label": "August 2026",
            "offset": 56,
          },
          Object {
            "label": "September 2026",
            "offset": 57,
          },
          Object {
            "label": "October 2026",
            "offset": 58,
          },
          Object {
            "label": "November 2026",
            "offset": 59,
          },
          Object {
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
