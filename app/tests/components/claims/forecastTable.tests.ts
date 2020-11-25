import { calculateOverheadCell } from "../../../src/ui/components/claims/forecastTable";
import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";

describe("calculateOverheadCell()", () => {
  const stubCell: ForecastDetailsDTO = {
    costCategoryId: "labour_id",
    periodId: 3,
    value: 1000,
    // TODO: Remove this unneeded properties from source
    id: "stub-id",
    periodStart: null,
    periodEnd: null,
  };

  test("should recalculate value", () => {
    const stubOverheadRate = 10;
    const overheadCalculation = calculateOverheadCell(
      stubOverheadRate,
      stubCell.costCategoryId,
      5,
      stubCell
    );

    const expectedResult = stubCell.value / stubOverheadRate;

    expect(overheadCalculation).toBe(expectedResult);
  });

  test("should return original value", () => {
    const overheadCalculation = calculateOverheadCell(
      10,
      "no-matching-labourCategoryId",
      5,
      stubCell
    );

    expect(overheadCalculation).toBe(5);
  });
});
