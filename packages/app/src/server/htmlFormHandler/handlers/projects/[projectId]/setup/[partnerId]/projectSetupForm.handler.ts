import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { ProjectDashboardRoute } from "@ui/pages/projects/dashboard/Dashboard.page";
import { ProjectSetupParams, ProjectSetupRoute } from "@ui/pages/projects/setup/projectSetup.page";
import {
  projectSetupErrorMap,
  projectSetupSchema,
  ProjectSetupSchema,
} from "@ui/pages/projects/setup/projectSetup.zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { options } from "@framework/mappers/partnerStatus";

class ProjectSetupFormHandler extends ZodFormHandlerBase<ProjectSetupSchema, ProjectSetupParams> {
  constructor() {
    super({
      routes: [ProjectSetupRoute],
      forms: [FormTypes.ProjectSetup],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: projectSetupSchema,
      errorMap: projectSetupErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<ProjectSetupSchema>> {
    return {
      form: input.form,
      postcode: input.postcode,
      bankDetailsTaskStatus: Number(input.bankDetailsTaskStatus),
      spendProfileStatus: Number(input.spendProfileStatus),
    };
  }

  protected async run({ params, context }: { params: ProjectSetupParams; context: IContext }): Promise<string> {
    await context.repositories.partners.update({
      Id: params.partnerId,
      Acc_ParticipantStatus__c: options.active,
    });

    return ProjectDashboardRoute.getLink({}).path;
  }
}

export { ProjectSetupFormHandler };
