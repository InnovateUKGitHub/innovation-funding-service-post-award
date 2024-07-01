import { clientsideApiClient } from "@ui/apiClient";
import { FormTypes } from "@ui/zod/FormTypes";
import { ForecastTableSchemaType } from "@ui/zod/forecastTableValidation.zod";
import type { z } from "zod";
import { useOnUpdate } from "./onUpdate";
import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { useNavigate } from "react-router-dom";
import { useRoutes } from "@ui/context/routesProvider";
import { parseCurrency, validCurrencyRegex } from "@framework/util/numberHelper";

interface OnForecastSubmitProps {
  periodId?: PeriodId;
  isPm: boolean;
  refresh?: () => Promise<void>;
}

export const useOnForecastSubmit = <Inputs extends z.output<ForecastTableSchemaType>>({
  refresh,
  periodId,
  isPm,
}: OnForecastSubmitProps) => {
  const navigate = useNavigate();
  const routes = useRoutes();

  return useOnUpdate<Inputs, unknown>({
    async req(data) {
      const { projectId, partnerId, profile, form, submit } = data;

      if (profile) {
        const forecasts: Pick<ForecastDetailsDTO, "id" | "value">[] = Object.entries(profile).map(([id, forecast]) => {
          const numberComponent = validCurrencyRegex.exec(forecast ?? "")?.[0] ?? "";

          return {
            id,
            value: parseCurrency(numberComponent),
          };
        });

        const forecastDetails = {
          projectId,
          partnerId,
          forecasts: forecasts as ForecastDetailsDTO[],
          submit,
        };

        switch (form) {
          case FormTypes.ProjectSetupForecast:
            return await clientsideApiClient.initialForecastDetails.update(forecastDetails);
          case FormTypes.ClaimForecastSaveAndContinue:
          case FormTypes.ClaimForecastSaveAndQuit:
          case FormTypes.ForecastTileForecast:
            return await clientsideApiClient.forecastDetails.update(forecastDetails);
        }
      }
    },
    async onSuccess(data) {
      const { projectId, partnerId, form } = data;

      await refresh?.();

      switch (form) {
        case FormTypes.ProjectSetupForecast:
          navigate(routes.projectSetup.getLink({ projectId, partnerId }).path);
          break;
        case FormTypes.ClaimForecastSaveAndContinue:
          navigate(routes.claimSummary.getLink({ projectId, partnerId, periodId: periodId ?? (0 as PeriodId) }).path);
          break;
        case FormTypes.ClaimForecastSaveAndQuit:
          if (isPm) {
            navigate(routes.allClaimsDashboard.getLink({ projectId }).path);
          } else {
            navigate(routes.claimsDashboard.getLink({ projectId, partnerId }).path);
          }
          break;
        case FormTypes.ForecastTileForecast:
          navigate(routes.viewForecast.getLink({ projectId, partnerId }).path);
      }
    },
  });
};
