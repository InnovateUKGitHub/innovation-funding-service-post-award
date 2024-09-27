import { makeZodI18nMap } from "@shared/zodi18n";
import { integerRangeInput } from "@ui/zod/helperValidators.zod";
import { z } from "zod";

export const createMonitoringReportErrorMap = makeZodI18nMap({ keyPrefix: ["monitoringReportCreate"] });

export const createMonitoringReportSchema = (maxNumberOfPeriods: number) =>
  z.object({
    period: integerRangeInput(1, maxNumberOfPeriods),
    button_submit: z.string(),
  });
