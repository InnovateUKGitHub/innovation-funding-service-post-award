import { SpendProfileStatus } from "@framework/constants/partner";
import { PartnerSpendProfileStatusMapper } from "@framework/mappers/spendProfileStatusMapper";
import { IContext } from "@framework/types/IContext";
import { parseCurrency } from "@framework/util/numberHelper";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { ProjectSetupRoute } from "@ui/pages/projects/setup/projectSetup.page";
import { ProjectSetupSpendProfileRoute } from "@ui/pages/projects/setup/projectSetupSpendProfile/projectSetupSpendProfile.page";
import {
  setupSpendProfileSchema,
  errorMap,
  SetupSpendProfileSchemaType,
} from "@ui/pages/projects/setup/projectSetupSpendProfile/projectSetupSpendProfile.zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

interface InitialForecastHandlerParams {
  projectId: ProjectId;
  partnerId: PartnerId;
}
export class InitialForecastHandler extends ZodFormHandlerBase<
  SetupSpendProfileSchemaType,
  InitialForecastHandlerParams
> {
  constructor() {
    super({
      routes: [ProjectSetupSpendProfileRoute],
      forms: [FormTypes.ProjectSetupForecast],
    });
  }

  public readonly acceptFiles = false;

  async getZodSchema() {
    return { schema: setupSpendProfileSchema, errorMap };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<SetupSpendProfileSchemaType>> {
    const profile = Object.keys(input)
      .filter(x => /^profile/.test(x))
      .reduce((acc, cur) => {
        const profileId = cur.replace("profile.", "");
        const value = input[cur];
        return {
          ...acc,

          [profileId]: value,
        };
      }, {});

    const initialProfile = JSON.parse(input.initialProfile);

    const costCategoryProfiles = JSON.parse(input.costCategoryProfiles);

    return {
      form: input.form,
      profile,
      submit: input.submit === "on" || input.submit === "true",
      costCategoryProfiles,
      initialProfile,
    };
  }

  protected async run({
    input,
    params,
    context,
  }: {
    input: z.output<SetupSpendProfileSchemaType>;
    params: InitialForecastHandlerParams;
    context: IContext;
  }): Promise<string> {
    const updatedStatus = SpendProfileStatus[input.submit ? "Complete" : "Incomplete"];
    const updatedSpendProfile = new PartnerSpendProfileStatusMapper().mapToSalesforce(updatedStatus);

    const updatedPartner = {
      Id: params.partnerId,
      Acc_SpendProfileCompleted__c: updatedSpendProfile,
    };

    const updates = input.submit
      ? Object.entries(input.profile).map(([id, value]) => ({
          Id: id,
          Acc_InitialForecastCost__c: parseCurrency(value),
          Acc_LatestForecastCost__c: parseCurrency(value),
        }))
      : Object.entries(input.profile)
          .filter(([id, value]) => input.initialProfile[id] !== value)
          .map(([id, value]) => ({
            Id: id,
            Acc_InitialForecastCost__c: parseCurrency(value),
          }));

    await Promise.all([
      context.repositories.profileDetails.update(updates),
      context.repositories.partners.update(updatedPartner),
    ]);

    return ProjectSetupRoute.getLink({ projectId: params.projectId, partnerId: params.partnerId }).path;
  }
}
