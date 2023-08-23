import { ProjectRole } from "@framework/constants/project";
import { IContext } from "@framework/types/IContext";
import { GetAllClaimDetailsByPartner } from "@server/features/claimDetails/getAllByPartnerQuery";
import { GetAllForPartnerQuery } from "@server/features/claims/getAllForPartnerQuery";
import { GetAllForecastsGOLCostsQuery } from "@server/features/claims/getAllForecastGOLCostsQuery";
import { GetAllForecastsForPartnerQuery } from "@server/features/forecastDetails/getAllForecastsForPartnerQuery";
import { UpdateForecastDetailsCommand } from "@server/features/forecastDetails/updateForecastDetailsCommand";
import { GetAllProjectRolesForUser } from "@server/features/projects/getAllProjectRolesForUser";
import { GetByIdQuery } from "@server/features/projects/getDetailsByIdQuery";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { AllClaimsDashboardRoute } from "@ui/containers/pages/claims/allClaimsDashboard/allClaimsDashboard.page";
import { ClaimsDashboardRoute } from "@ui/containers/pages/claims/dashboard.page";
import { ClaimForecastRoute } from "@ui/containers/pages/claims/forecast/ClaimForecast.page";
import { ClaimSummaryRoute } from "@ui/containers/pages/claims/summary.page";
import { FormTypes } from "@ui/zod/FormTypes";
import { ForecastTableSchemaType, getForecastTableValidation } from "@ui/zod/forecastTableValidation.zod";
import { z } from "zod";

interface ClaimForecastFormHandlerParams {
  projectId: ProjectId;
  partnerId: PartnerId;
  periodId: PeriodId;
}
class ClaimForecastFormHandler extends ZodFormHandlerBase<ForecastTableSchemaType, ClaimForecastFormHandlerParams> {
  constructor() {
    super({
      route: ClaimForecastRoute,
      forms: [FormTypes.ClaimForecastSaveAndContinue, FormTypes.ClaimForecastSaveAndQuit],
    });
  }

  public readonly acceptFiles = false;

  async getZodSchema({ context, params }: { context: IContext; params: ClaimForecastFormHandlerParams }) {
    const projectPromise = context.runQuery(new GetByIdQuery(params.projectId));
    const claimDetailsPromise = context.runQuery(new GetAllClaimDetailsByPartner(params.partnerId));
    const claimsPromise = context.runQuery(new GetAllForPartnerQuery(params.partnerId));
    const costCategoriesPromise = context.runQuery(new GetAllForecastsGOLCostsQuery(params.partnerId));
    const profilesPromise = context.runQuery(new GetAllForecastsForPartnerQuery(params.partnerId));

    const [project, claimDetails, claims, costCategories, profiles] = await Promise.all([
      projectPromise,
      claimDetailsPromise,
      claimsPromise,
      costCategoriesPromise,
      profilesPromise,
    ]);

    return getForecastTableValidation({
      claimDetails,
      claims,
      costCategories,
      profiles,
      project,
    });
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<ForecastTableSchemaType>> {
    return {
      form: input.form,
      partnerId: input.partnerId,
      projectId: input.projectId,
      profile: Object.fromEntries(
        Object.entries(input)
          .filter(([key]) => key.startsWith("profile."))
          .map(([key, value]) => [key.replace("profile.", ""), value]),
      ),
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.input<ForecastTableSchemaType>;
    context: IContext;
    params: ClaimForecastFormHandlerParams;
  }): Promise<string> {
    if (input.profile) {
      await context.runCommand(
        new UpdateForecastDetailsCommand(
          params.projectId,
          params.partnerId,
          Object.entries(input.profile).map(([id, value]) => ({
            id,
            value: parseFloat(value),
          })),
          false,
        ),
      );
    }

    if (input.form === FormTypes.ClaimForecastSaveAndContinue) {
      return ClaimSummaryRoute.getLink(params).path;
    }

    // if pm as well as fc then go to all claims route
    const roles = await context.runQuery(new GetAllProjectRolesForUser()).then(x => x.forProject(params.projectId));
    if (roles.hasRole(ProjectRole.ProjectManager)) {
      return AllClaimsDashboardRoute.getLink(params).path;
    }

    return ClaimsDashboardRoute.getLink(params).path;
  }
}

export { ClaimForecastFormHandler };
