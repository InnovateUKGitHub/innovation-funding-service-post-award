import { ForecastDetailsDTO, ProjectDto } from "@framework/dtos";

// TODO: ACC-7461
export const getArrayFromPeriod = (
  originalArray: ForecastDetailsDTO[],
  currentPeriod: ProjectDto["periodId"],
): ForecastDetailsDTO[] => {
  if (originalArray.length === 0) return [];
  return originalArray.filter(forecastDetails => forecastDetails.periodId >= currentPeriod);
};
