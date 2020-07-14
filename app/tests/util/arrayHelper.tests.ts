import { groupBy } from "@framework/util";

describe("arrayHelper", () => {

  describe("groupBy", () => {
    it("should return a map", () => {
      const arr: string[] = [];
      const result = groupBy(arr, (entry) => entry.toString());
      expect(result).toBeInstanceOf(Map);
    });
    it("should group by simple entry", () => {
      const arr: number[] = [1, 1, 3, 1, 2, 3];
      const result = groupBy(arr, (entry) => entry);
      expect(result.size).toEqual(3);
      expect(result.get(1)).toEqual([1, 1, 1]);
      expect(result.get(2)).toEqual([2]);
      expect(result.get(3)).toEqual([3, 3]);
    });
    it("should group by key", () => {
      const arr: string[] = ["foo", "ba", "fooooo", "bar", "faa", "baaaar"];
      const result = groupBy(arr, (entry) => entry.length);
      expect(result.size).toEqual(3);
      expect(result.get(2)).toEqual(["ba"]);
      expect(result.get(3)).toEqual(["foo", "bar", "faa"]);
      expect(result.get(6)).toEqual(["fooooo", "baaaar"]);
    });
  });

});
