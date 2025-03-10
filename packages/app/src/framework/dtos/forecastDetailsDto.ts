import { ForecastPageSchema } from "@ui/pages/forecasts/forecastPage.zod";
import { SetupSpendProfileSchemaType } from "@ui/pages/projects/setup/projectSetupSpendProfile/projectSetupSpendProfile.zod";
import { z } from "zod";

export interface ForecastDetailsDTO {
  costCategoryId: CostCategoryId;
  id: string;
  periodEnd: Date | null;
  periodId: PeriodId;
  periodStart: Date | null;
  value: number;
}

export type ForecastUpdateDto = z.output<ForecastPageSchema>;
export type InitialForecastDto = z.output<SetupSpendProfileSchemaType>;
