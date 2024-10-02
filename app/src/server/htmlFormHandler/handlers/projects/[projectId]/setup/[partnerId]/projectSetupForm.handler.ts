import { IContext } from "@framework/types/IContext";
import { UpdatePartnerCommand } from "@server/features/partners/updatePartnerCommand";
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
import { GetByIdQuery } from "@server/features/projects/getDetailsByIdQuery";

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

  protected async run({
    input,
    params,
    context,
  }: {
    input: z.output<ProjectSetupSchema>;
    params: ProjectSetupParams;
    context: IContext;
  }): Promise<string> {
    const project = await context.runQuery(new GetByIdQuery(params.projectId));
    await context.runCommand(
      new UpdatePartnerCommand(
        { id: params.partnerId, projectId: params.projectId, ...input },
        { projectSource: project.projectSource },
      ),
    );

    return ProjectDashboardRoute.getLink({}).path;
  }
}

export { ProjectSetupFormHandler };
