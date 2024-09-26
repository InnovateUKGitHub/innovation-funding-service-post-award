import { makeZodI18nMap } from "@shared/zodi18n";
import { getNumberValidation } from "@ui/zod/numericValidator.zod";

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
    }),
    button_submit: z.string(),
  });
