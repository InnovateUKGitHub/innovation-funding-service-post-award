import { clientsideApiClient } from "@ui/apiClient";
import { FormTypes } from "@ui/zod/FormTypes";
import { ForecastTableSchemaType } from "@ui/zod/forecastTableValidation.zod";
import type { z } from "zod";
import { useOnUpdate } from "./onUpdate";
import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { useNavigate } from "react-router-dom";
import { useRoutes } from "@ui/redux/routesProvider";

interface OnForecastSubmitProps {
  periodId: PeriodId;
  profiles: Pick<ForecastDetailsDTO, "costCategoryId" | "id" | "periodId">[];
}

export const useOnForecastSubmit = <Inputs extends z.output<ForecastTableSchemaType>>({
  periodId,
  profiles,
}: OnForecastSubmitProps) => {
  const navigate = useNavigate();
  const routes = useRoutes();

  return useOnUpdate<Inputs, unknown>({
    async req(data) {
      const { projectId, partnerId, profile } = data;

      if (profile) {
        const forecasts: Pick<ForecastDetailsDTO, "id" | "value" | "costCategoryId" | "periodId">[] = [];
        for (const [id, forecast] of Object.entries(profile)) {
          const profile = profiles.find(x => x.id === id);

          if (!profile) throw new Error("Missing ID on profiles");

          forecasts.push({
            id,
            value: parseFloat(forecast),
            costCategoryId: profile.costCategoryId,
            periodId: profile.periodId,
          });
        }

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
          navigate(routes.forecastDashboard.getLink({ projectId }).path);
          break;
      }
    },
  });
};
