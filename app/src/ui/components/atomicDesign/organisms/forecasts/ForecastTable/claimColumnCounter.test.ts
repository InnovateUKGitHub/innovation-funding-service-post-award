import { getColumnData } from "./claimColumnCounter";

describe("getColumnData", () => {
  test.each([
    // Period 0, Project Setup. 12 Forecast columns.
    [12, 0, null, 0, 12],

    // Period null, Project ended. No more "claim" or "forecast" columns
    [12, null, null, 12, 0],

    // Inbetween columns...
    [12, 1, 1, 0, 11],
    [12, 2, 2, 1, 10],
    [12, 3, 3, 2, 9],
    [12, 4, 4, 3, 8],
    [12, 5, 5, 4, 7],
    [12, 6, 6, 5, 6],
    [12, 7, 7, 6, 5],
    [12, 8, 8, 7, 4],
    [12, 9, 9, 8, 3],
    [12, 10, 10, 9, 2],
    [12, 11, 11, 10, 1],
    [12, 12, 12, 11, 0],
  ])(
    "When there are %d periods and we are claiming period %d",
    (numberOfClaims, currentClaimNumber, expectedClaimNumber, expectedClaimedColumns, expectedForecastColumns) => {
      expect(getColumnData({ numberOfClaims, currentClaimNumber })).toStrictEqual({
        currentClaimNumber: expectedClaimNumber,
        numberOfClaimedColumns: expectedClaimedColumns,
        numberOfForecastColumns: expectedForecastColumns,
      });
    },
  );
});
