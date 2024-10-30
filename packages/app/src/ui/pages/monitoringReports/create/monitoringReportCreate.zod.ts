import { makeZodI18nMap } from "@shared/zodi18n";
import { getNumberValidation } from "@ui/zod/numericValidator.zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

export const createMonitoringReportErrorMap = makeZodI18nMap({ keyPrefix: ["monitoringReportCreate"] });

export const createMonitoringReportSchema = (maxNumberOfPeriods: number) =>
  z.object({
    period: getNumberValidation({
      min: 1,
      max: maxNumberOfPeriods,
      integer: true,
      required: true,
      showValidRange: true,
    }).transform(x => x as PeriodId),
    button_submit: z.union([z.literal("saveAndContinue"), z.literal("saveAndReturn")]),
    form: z.union([z.literal(FormTypes.MonitoringReportCreate), z.literal(FormTypes.MonitoringReportPreparePeriod)]),
  });

export type MonitoringReportCreateSchema = ReturnType<typeof createMonitoringReportSchema>;
