import { ProjectRolePermissionBits } from "@framework/constants/project";
import { IContext } from "@framework/types/IContext";
import { parseCurrency } from "@framework/util/numberHelper";
import { GetForecastTableDataInputPropsQuery } from "@server/features/forecastDetails/GetForecastTableDataInputPropsQuery";
import { GetAllProjectRolesForUser } from "@server/features/projects/getAllProjectRolesForUser";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { IRouteDefinition } from "@ui/app/containerBase";
import { AllClaimsDashboardRoute } from "@ui/pages/claims/allClaimsDashboard/allClaimsDashboard.page";
import { ClaimsDashboardRoute } from "@ui/pages/claims/claimDashboard.page";
import { ClaimSummaryRoute } from "@ui/pages/claims/claimSummary.page";
import { ClaimForecastRoute } from "@ui/pages/claims/forecast/ClaimForecast.page";
import { UpdateForecastRoute } from "@ui/pages/forecasts/UpdateForecastTile.page";
import { ViewForecastRoute } from "@ui/pages/forecasts/ViewForecastTile.page";
import { FormTypes } from "@ui/zod/FormTypes";
import { ForecastTableSchemaType, getForecastTableValidation } from "@ui/zod/forecastTableValidation.zod";
import { z } from "zod";

interface ForecastHandlerParams {
  projectId: ProjectId;
  partnerId: PartnerId;
  periodId: PeriodId | undefined;
}
class ForecastHandler extends ZodFormHandlerBase<ForecastTableSchemaType, ForecastHandlerParams> {
  constructor() {
    super({
      routes: [ClaimForecastRoute, UpdateForecastRoute] as IRouteDefinition<ForecastHandlerParams>[],
      forms: [
        FormTypes.ClaimForecastSaveAndContinue,
        FormTypes.ClaimForecastSaveAndQuit,
        FormTypes.ForecastTileForecast,
      ],
    });
  }

  public readonly acceptFiles = false;

  async getZodSchema({ context, input }: { context: IContext; input: z.input<ForecastTableSchemaType> }) {
    const data = await context.runQuery(
      new GetForecastTableDataInputPropsQuery({
        projectId: input.projectId as ProjectId,
        partnerId: input.partnerId as PartnerId,
      }),
    );

    return getForecastTableValidation(data);
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<ForecastTableSchemaType>> {
    return {
      form: input.form,
      projectId: input.projectId,
      partnerId: input.partnerId,
      profile: Object.fromEntries(
        Object.entries(input)
          .filter(([key]) => key.startsWith("profile."))
          .map(([key, value]) => [key.replace("profile.", ""), value]),
      ),
      submit: input.submit === "on" || input.submit === "true",
    };
  }

  protected async run({
    input,
    params,
    context,
  }: {
    input: z.output<ForecastTableSchemaType>;
    params: ForecastHandlerParams;
    context: IContext;
  }): Promise<string> {
    if (
      input.form === FormTypes.ClaimForecastSaveAndContinue ||
      input.form === FormTypes.ClaimForecastSaveAndQuit ||
      input.form === FormTypes.ForecastTileForecast
    ) {
      const updates = Object.entries(input.profile).map(entry => ({
        Id: entry[0],
        Acc_LatestForecastCost__c: parseCurrency(entry[1]),
      }));

      await context.repositories.profileDetails.update(updates);
    }

    switch (input.form) {
      case FormTypes.ClaimForecastSaveAndContinue:
        return ClaimSummaryRoute.getLink({
          projectId: input.projectId,
          partnerId: input.partnerId,
          periodId: params.periodId as PeriodId,
        }).path;
      case FormTypes.ClaimForecastSaveAndQuit:
        // if pm as well as fc then go to all claims route
        const roles = await context.runQuery(new GetAllProjectRolesForUser()).then(x => x.forProject(params.projectId));
        if (roles.hasRole(ProjectRolePermissionBits.ProjectManager)) {
          return AllClaimsDashboardRoute.getLink({
            projectId: input.projectId,
          }).path;
        }

        return ClaimsDashboardRoute.getLink({
          projectId: input.projectId,
          partnerId: input.partnerId,
        }).path;
      case FormTypes.ForecastTileForecast:
      default:
        return ViewForecastRoute.getLink({ projectId: input.projectId, partnerId: input.partnerId }).path;
    }
  }
}

export { ForecastHandler };
