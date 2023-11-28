import { clientsideApiClient } from "@ui/apiClient";
import { FormTypes } from "@ui/zod/FormTypes";
import { ForecastTableSchemaType } from "@ui/zod/forecastTableValidation.zod";
import type { z } from "zod";
import { useOnUpdate } from "./onUpdate";
import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { useNavigate } from "react-router-dom";
import { useRoutes } from "@ui/redux/routesProvider";
import { validCurrencyRegex } from "@framework/util/numberHelper";

interface OnForecastSubmitProps {
  periodId: PeriodId;
  isPm: boolean;
}

export const useOnForecastSubmit = <Inputs extends z.output<ForecastTableSchemaType>>({
  periodId,
  isPm,
}: OnForecastSubmitProps) => {
  const navigate = useNavigate();
  const routes = useRoutes();

  return useOnUpdate<Inputs, unknown>({
    async req(data) {
      const { projectId, partnerId, profile } = data;

      if (profile) {
        const forecasts: Pick<ForecastDetailsDTO, "id" | "value">[] = Object.entries(profile).map(([id, forecast]) => {
          const numberComponent = validCurrencyRegex.exec(forecast)?.[1] ?? "";

          return {
            id,
            value: parseFloat(numberComponent),
          };
        });

        await clientsideApiClient.forecastDetails.update({
          projectId,
          partnerId,
          forecasts: forecasts as ForecastDetailsDTO[],
          submit: false,
        });
      }
    },
    onSuccess(data) {
      const { projectId, partnerId, form } = data;

      switch (form) {
        case FormTypes.ClaimForecastSaveAndContinue:
          navigate(routes.claimSummary.getLink({ projectId, partnerId, periodId }).path);
          break;
        case FormTypes.ClaimForecastSaveAndQuit:
          if (isPm) {
            navigate(routes.allClaimsDashboard.getLink({ projectId }).path);
          } else {
            navigate(routes.claimsDashboard.getLink({ projectId, partnerId }).path);
          }
          break;
      }
    },
  });
};
