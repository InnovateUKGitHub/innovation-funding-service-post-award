import { getArrayFromPeriod, getArrayExcludingPeriods, groupBy } from "@framework/util";

interface ListWithPeriodId {
  periodId: number;
}

function createIncrementingPeriodData(totalStubCount: number): ListWithPeriodId[] {
  const arr = [] as ListWithPeriodId[];

  for (let i = 1; i <= totalStubCount; i++) {
    arr.push({ periodId: i } as ListWithPeriodId);
  }

  return arr;
}

describe("arrayHelpers", () => {
  describe("groupBy()", () => {
    it("should return a map", () => {
      const arr: string[] = [];
      const result = groupBy(arr, entry => entry.toString());
      expect(result).toBeInstanceOf(Map);
    });
    it("should group by simple entry", () => {
      const arr: number[] = [1, 1, 3, 1, 2, 3];
      const result = groupBy(arr, entry => entry);
      expect(result.size).toEqual(3);
      expect(result.get(1)).toEqual([1, 1, 1]);
      expect(result.get(2)).toEqual([2]);
      expect(result.get(3)).toEqual([3, 3]);
    });
    it("should group by key", () => {
      const arr: string[] = ["foo", "ba", "fooooo", "bar", "faa", "baaaar"];
      const result = groupBy(arr, entry => entry.length);
      expect(result.size).toEqual(3);
      expect(result.get(2)).toEqual(["ba"]);
      expect(result.get(3)).toEqual(["foo", "bar", "faa"]);
      expect(result.get(6)).toEqual(["fooooo", "baaaar"]);
    });
  });

  describe("getArrayExcludingPeriods()", () => {
    const listWithPeriodId = createIncrementingPeriodData(10);

    it("should return list with filtered out periodIds that were included in the set passed in as second arg", () => {
      const excludePeriods = new Set([2, 4, 5]);

      expect(getArrayExcludingPeriods(listWithPeriodId, excludePeriods).map(x => x.periodId)).toEqual([
        1, 3, 6, 7, 8, 9, 10,
      ]);
    });
  });

  describe("getArrayFromPeriod()", () => {
    const stubEndPeriod = 10;
    const listWithPeriodId = createIncrementingPeriodData(10);

    const oneEntry = listWithPeriodId.slice(0, 1);
    const twoEntries = listWithPeriodId.slice(0, 2);
    const threeEntries = listWithPeriodId.slice(0, 3);
    const fourEntries = listWithPeriodId.slice(0, 5);

    describe("returns correct array total", () => {
      describe("when current period is 1", () => {
        test.each`
          name                   | list           | expectedLength
          ${"when empty"}        | ${[]}          | ${0}
          ${"with one entry"}    | ${oneEntry}    | ${1}
          ${"with two entries"}  | ${twoEntries}  | ${2}
          ${"with five entries"} | ${fourEntries} | ${5}
        `("$name", ({ list, expectedLength }) => {
          const futurePeriods = getArrayFromPeriod(list, 1, stubEndPeriod);
          expect(futurePeriods).toHaveLength(expectedLength);
        });
      });

      describe("when current period is 2", () => {
        test.each`
          name                   | list           | expectedLength
          ${"when empty"}        | ${[]}          | ${0}
          ${"with one entry"}    | ${oneEntry}    | ${0}
          ${"with two entries"}  | ${twoEntries}  | ${1}
          ${"with five entries"} | ${fourEntries} | ${4}
        `("$name", ({ list, expectedLength }) => {
          const futurePeriods = getArrayFromPeriod(list, 2, stubEndPeriod);
          expect(futurePeriods).toHaveLength(expectedLength);
        });
      });

      describe("when current period is 3", () => {
        test.each`
          name                    | list            | expectedLength
          ${"when empty"}         | ${[]}           | ${0}
          ${"with one entry"}     | ${oneEntry}     | ${0}
          ${"with three entries"} | ${threeEntries} | ${1}
          ${"with five entries"}  | ${fourEntries}  | ${3}
        `("$name", ({ list, expectedLength }) => {
          const futurePeriods = getArrayFromPeriod(list, 3, stubEndPeriod);
          expect(futurePeriods).toHaveLength(expectedLength);
        });
      });

      describe("when no lastPeriod provided", () => {
        test("should respect from filter period", () => {
          const noPeriods = getArrayFromPeriod([], 1);
          expect(noPeriods).toHaveLength(0);

          const futurePeriods = getArrayFromPeriod(listWithPeriodId, 1);
          expect(futurePeriods).toHaveLength(listWithPeriodId.length);
        });
      });
    });

    describe("returns correct payload", () => {
      test("should return no array if inbound array is empty", () => {
        const futurePeriods = getArrayFromPeriod([], 1, stubEndPeriod);

        expect(futurePeriods).toHaveLength(0);
      });

      test("should return only future data", () => {
        const futurePeriods = getArrayFromPeriod(fourEntries, 4, stubEndPeriod);

        futurePeriods.forEach(x => {
          expect(x.periodId).toBeGreaterThanOrEqual(4);
        });
      });

      describe("should only return future data before the project end date", () => {
        test("filtered array length is correct", () => {
          const futurePeriods = getArrayFromPeriod(listWithPeriodId, 1, 5);

          expect(futurePeriods.length).toBe(5);
        });

        test("filtered array contents are correct", () => {
          const futurePeriods = getArrayFromPeriod(listWithPeriodId, 1, 5);

          futurePeriods.forEach(x => {
            expect(x.periodId).toBeGreaterThanOrEqual(1);
            expect(x.periodId).toBeLessThanOrEqual(5);
          });
        });
      });
    });
  });
});
