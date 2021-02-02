// tslint:disable: no-duplicate-string no-identical-functions
import { ForecastDetailsDTO } from "@framework/dtos";
import { getArrayFromPeriod } from "@ui/containers/claims/utils/claimForecastUtils";

describe("claim forecast utils", () => {
  describe("getArrayFromPeriod()", () => {
    function createIncrementingPeriodData<Dto extends ForecastDetailsDTO>(totalStubCount: number): Dto[] {
      const forecastDetails = [] as Dto[];

      for (let i = 1; i <= totalStubCount; i++) {
        forecastDetails.push({ periodId: i } as Dto);
      }

      return forecastDetails;
    }

    const multipleForecastDetails = createIncrementingPeriodData(10);

    const singleForecastDetail = multipleForecastDetails.slice(0, 1);
    const twoForecastDetails = multipleForecastDetails.slice(0, 2);
    const threeForecastDetails = multipleForecastDetails.slice(0, 3);
    const fiveForecastDetails = multipleForecastDetails.slice(0, 5);

    describe("returns correct array total", () => {
      describe("when current period is 1", () => {
        test.each`
          name                   | forecastDetails         | expected
          ${"when empty"}        | ${[]}                   | ${0}
          ${"with one entry"}    | ${singleForecastDetail} | ${1}
          ${"with two entries"}  | ${twoForecastDetails}   | ${2}
          ${"with five entries"} | ${fiveForecastDetails}  | ${5}
        `("$name", ({ forecastDetails, expected }) => {
          const futureForecasts = getArrayFromPeriod(forecastDetails, 1);
          expect(futureForecasts).toHaveLength(expected);
        });
      });

      describe("when current period is 2", () => {
        test.each`
          name                   | forecastDetails         | expected
          ${"when empty"}        | ${[]}                   | ${0}
          ${"with one entry"}    | ${singleForecastDetail} | ${0}
          ${"with two entries"}  | ${twoForecastDetails}   | ${1}
          ${"with five entries"} | ${fiveForecastDetails}  | ${4}
        `("$name", ({ forecastDetails, expected }) => {
          const futureForecasts = getArrayFromPeriod(forecastDetails, 2);
          expect(futureForecasts).toHaveLength(expected);
        });
      });

      describe("when current period is 3", () => {
        test.each`
          name                    | forecastDetails         | expected
          ${"when empty"}         | ${[]}                   | ${0}
          ${"with one entry"}     | ${singleForecastDetail} | ${0}
          ${"with three entries"} | ${threeForecastDetails} | ${1}
          ${"with five entries"}  | ${fiveForecastDetails}  | ${3}
        `("$name", ({ forecastDetails, expected }) => {
          const futureForecasts = getArrayFromPeriod(forecastDetails, 3);
          expect(futureForecasts).toHaveLength(expected);
        });
      });
    });

    describe("returns correct payload", () => {
      test("should return no forecasts if inbound array is empty", () => {
        const forecasts = getArrayFromPeriod([], 1);

        expect(forecasts).toHaveLength(0);
      });

      test("should return only future forecast data", () => {
        const forecasts = getArrayFromPeriod(fiveForecastDetails, 4);

        forecasts.forEach(x => {
          expect(x.periodId).toBeGreaterThanOrEqual(4);
        });
      });
    });
  });
});
