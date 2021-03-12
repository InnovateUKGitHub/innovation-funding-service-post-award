import { ForecastDetailsDTO, ProjectDto } from "@framework/dtos";

// TODO: ACC-7461
export const getArrayFromPeriod = (
  originalArray: ForecastDetailsDTO[],
  currentPeriod: ProjectDto["periodId"],
  lastPeriodId: number,
): ForecastDetailsDTO[] => {
  if (originalArray.length === 0) return [];
  return originalArray.filter(
    forecast => forecast.periodId >= currentPeriod && forecast.periodId <= lastPeriodId,
  );
};
