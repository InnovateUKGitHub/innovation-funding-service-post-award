import { IContext } from "@framework/types/IContext";
import { DeleteProjectChangeRequestCommand } from "@server/features/pcrs/deleteProjectChangeRequestCommand";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { PCRsDashboardRoute } from "@ui/pages/pcrs/dashboard/PCRDashboard.page";
import { PCRDeleteParams, PCRDeleteRoute } from "@ui/pages/pcrs/pcrDelete.page";
import { FormTypes } from "@ui/zod/FormTypes";
import { pcrModifyErrorMap } from "@ui/zod/pcrValidator.zod";
import { z } from "zod";

const emptySchema = z.object({
  form: z.literal(FormTypes.ProjectChangeRequestDelete),
});
type EmptySchema = typeof emptySchema;

class ProjectChangeRequestDeleteFormHandler extends ZodFormHandlerBase<EmptySchema, PCRDeleteParams> {
  constructor() {
    super({
      routes: [PCRDeleteRoute],
      forms: [FormTypes.ProjectChangeRequestDelete],
    });
  }

  acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: emptySchema,
      errorMap: pcrModifyErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<EmptySchema>> {
    return {
      form: input.form,
    };
  }

  protected async run({ context, params }: { params: PCRDeleteParams; context: IContext }): Promise<string> {
    await context.runCommand(new DeleteProjectChangeRequestCommand(params.projectId, params.pcrId));
    return PCRsDashboardRoute.getLink({ projectId: params.projectId }).path;
  }
}

export { ProjectChangeRequestDeleteFormHandler };
