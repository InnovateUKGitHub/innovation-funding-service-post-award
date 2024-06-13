import { ProjectRole } from "@framework/constants/project";
import { IContext } from "@framework/types/IContext";
import { GetAllClaimDetailsByPartner } from "@server/features/claimDetails/getAllByPartnerQuery";
import { GetAllForPartnerQuery } from "@server/features/claims/getAllForPartnerQuery";
import { GetAllForecastsGOLCostsQuery } from "@server/features/claims/getAllForecastGOLCostsQuery";
import { GetAllForecastsForPartnerQuery } from "@server/features/forecastDetails/getAllForecastsForPartnerQuery";
import { UpdateForecastDetailsCommand } from "@server/features/forecastDetails/updateForecastDetailsCommand";
import { GetByIdQuery as GetPartnerByIdQuery } from "@server/features/partners/getByIdQuery";
import { GetAllProjectRolesForUser } from "@server/features/projects/getAllProjectRolesForUser";
import { GetByIdQuery as GetProjectByIdQuery } from "@server/features/projects/getDetailsByIdQuery";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { AllClaimsDashboardRoute } from "@ui/containers/pages/claims/allClaimsDashboard/allClaimsDashboard.page";
import { ClaimsDashboardRoute } from "@ui/containers/pages/claims/claimDashboard.page";
import { ClaimForecastRoute } from "@ui/containers/pages/claims/forecast/ClaimForecast.page";
import { ClaimSummaryRoute } from "@ui/containers/pages/claims/claimSummary.page";
import { FormTypes } from "@ui/zod/FormTypes";
import { ForecastTableSchemaType, getForecastTableValidation } from "@ui/zod/forecastTableValidation.zod";
import { z } from "zod";
import { UpdateInitialForecastDetailsCommand } from "@server/features/forecastDetails/updateInitialForecastDetailsCommand";
import { UpdateForecastRoute } from "@ui/containers/pages/forecasts/UpdateForecastTile.page";
import { ProjectSetupSpendProfileRoute } from "@ui/containers/pages/projects/setup/projectSetupSpendProfile/projectSetupSpendProfile.page";
import { IRouteDefinition } from "@ui/containers/containerBase";
import { ProjectSetupRoute } from "@ui/containers/pages/projects/setup/projectSetup.page";
import { ViewForecastRoute } from "@ui/containers/pages/forecasts/ViewForecastTile.page";
import { parseCurrency } from "@framework/util/numberHelper";

interface ForecastHandlerParams {
  projectId: ProjectId;
  partnerId: PartnerId;
  periodId: PeriodId | undefined;
}
class ForecastHandler extends ZodFormHandlerBase<ForecastTableSchemaType, ForecastHandlerParams> {
  constructor() {
    super({
      routes: [
        ClaimForecastRoute,
        ProjectSetupSpendProfileRoute,
        UpdateForecastRoute,
      ] as IRouteDefinition<ForecastHandlerParams>[],
      forms: [
        FormTypes.ProjectSetupForecast,
        FormTypes.ClaimForecastSaveAndContinue,
        FormTypes.ClaimForecastSaveAndQuit,
        FormTypes.ForecastTileForecast,
      ],
    });
  }

  public readonly acceptFiles = false;

  async getZodSchema({ context, input }: { context: IContext; input: z.input<ForecastTableSchemaType> }) {
    const projectPromise = context.runQuery(new GetProjectByIdQuery(input.projectId as ProjectId));
    const partnerPromise = context.runQuery(new GetPartnerByIdQuery(input.partnerId as PartnerId));
    const claimDetailsPromise = context.runQuery(new GetAllClaimDetailsByPartner(input.partnerId as PartnerId));
    const claimTotalProjectPeriodsPromise = context.runQuery(new GetAllForPartnerQuery(input.partnerId as PartnerId));
    const profileTotalCostCategoriesPromise = context.runQuery(
      new GetAllForecastsGOLCostsQuery(input.partnerId as PartnerId),
    );
    const profileDetailsPromise = context.runQuery(new GetAllForecastsForPartnerQuery(input.partnerId as PartnerId));

    const [project, claimDetails, claimTotalProjectPeriods, profileTotalCostCategories, profileDetails, partner] =
      await Promise.all([
        projectPromise,
        claimDetailsPromise,
        claimTotalProjectPeriodsPromise,
        profileTotalCostCategoriesPromise,
        profileDetailsPromise,
        partnerPromise,
      ]);

    return getForecastTableValidation({
      project,
      partner,
      claimDetails,
      claimTotalProjectPeriods,
      profileTotalCostCategories,
      profileDetails,
    });
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
      submit: input.submit,
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
    if (input.profile) {
      if (input.form === FormTypes.ProjectSetupForecast) {
        await context.runCommand(
          new UpdateInitialForecastDetailsCommand(
            input.projectId,
            input.partnerId,
            Object.entries(input.profile).map(([id, value]) => ({
              id,
              value: parseCurrency(value),
            })),
            false,
          ),
        );
      } else {
        await context.runCommand(
          new UpdateForecastDetailsCommand(
            input.projectId,
            input.partnerId,
            Object.entries(input.profile).map(([id, value]) => ({
              id,
              value: parseCurrency(value),
            })),
            false,
          ),
        );
      }
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
        if (roles.hasRole(ProjectRole.ProjectManager)) {
          return AllClaimsDashboardRoute.getLink({
            projectId: input.projectId,
          }).path;
        }

        return ClaimsDashboardRoute.getLink({
          projectId: input.projectId,
          partnerId: input.partnerId,
        }).path;
      case FormTypes.ProjectSetupForecast:
        return ProjectSetupRoute.getLink({ projectId: input.projectId, partnerId: input.partnerId }).path;
      case FormTypes.ForecastTileForecast:
        return ViewForecastRoute.getLink({ projectId: input.projectId, partnerId: input.partnerId }).path;
    }
  }
}

export { ForecastHandler };
