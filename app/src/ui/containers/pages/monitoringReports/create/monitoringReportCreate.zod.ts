import { makeZodI18nMap } from "@shared/zodi18n";
import { z } from "zod";

export const createMonitoringReportErrorMap = makeZodI18nMap({ keyPrefix: ["monitoringReportCreate"] });

export const createMonitoringReportSchema = (maxNumberOfPeriods: number) =>
  z.object({
    period: z.coerce.number().int().min(1).max(maxNumberOfPeriods),
    button_submit: z.string(),
  });
