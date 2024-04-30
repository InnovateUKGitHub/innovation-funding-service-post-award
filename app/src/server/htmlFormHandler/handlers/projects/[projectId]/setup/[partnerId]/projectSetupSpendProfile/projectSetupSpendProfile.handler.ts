import { IContext } from "@framework/types/IContext";
import { GetAllClaimDetailsByPartner } from "@server/features/claimDetails/getAllByPartnerQuery";
import { GetAllForPartnerQuery } from "@server/features/claims/getAllForPartnerQuery";
import { GetAllForecastsGOLCostsQuery } from "@server/features/claims/getAllForecastGOLCostsQuery";
import { GetAllInitialForecastsForPartnerQuery } from "@server/features/forecastDetails/getAllInitialForecastsForPartnerQuery";
import { UpdateInitialForecastDetailsCommand } from "@server/features/forecastDetails/updateInitialForecastDetailsCommand";
import { GetByIdQuery as GetPartnerByIdQuery } from "@server/features/partners/getByIdQuery";
import { GetByIdQuery as GetProjectByIdQuery } from "@server/features/projects/getDetailsByIdQuery";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { ProjectSetupRoute } from "@ui/containers/pages/projects/setup/projectSetup.page";
import {
  ProjectSetupSpendProfileParams,
  ProjectSetupSpendProfileRoute,
} from "@ui/containers/pages/projects/setup/projectSetupSpendProfile/projectSetupSpendProfile.page";
import { FormTypes } from "@ui/zod/FormTypes";
import { ForecastTableSchemaType, getForecastTableValidation } from "@ui/zod/forecastTableValidation.zod";
import { z } from "zod";

class ProjectSetupSpendProfileFormHandler extends ZodFormHandlerBase<
  ForecastTableSchemaType,
  ProjectSetupSpendProfileParams
> {
  constructor() {
    super({
      routes: [ProjectSetupSpendProfileRoute],
      forms: [FormTypes.ProjectSetupForecast],
    });
  }

  public readonly acceptFiles = false;

  async getZodSchema({ context, params }: { context: IContext; params: ProjectSetupSpendProfileParams }) {
    const projectPromise = context.runQuery(new GetProjectByIdQuery(params.projectId));
    const partnerPromise = context.runQuery(new GetPartnerByIdQuery(params.partnerId));
    const claimDetailsPromise = context.runQuery(new GetAllClaimDetailsByPartner(params.partnerId));
    const claimTotalProjectPeriodsPromise = context.runQuery(new GetAllForPartnerQuery(params.partnerId));
    const profileTotalCostCategoriesPromise = context.runQuery(new GetAllForecastsGOLCostsQuery(params.partnerId));
    const profileDetailsPromise = context.runQuery(new GetAllInitialForecastsForPartnerQuery(params.partnerId));

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
      partnerId: input.partnerId,
      projectId: input.projectId,
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
    context,
    params,
  }: {
    input: z.input<ForecastTableSchemaType>;
    context: IContext;
    params: ProjectSetupSpendProfileParams;
  }): Promise<string> {
    if (input.profile) {
      await context.runCommand(
        new UpdateInitialForecastDetailsCommand(
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

    return ProjectSetupRoute.getLink(params).path;
  }
}

export { ProjectSetupSpendProfileFormHandler };
