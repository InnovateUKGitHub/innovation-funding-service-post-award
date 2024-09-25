import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { ProjectSetupRoute } from "@ui/containers/pages/projects/setup/projectSetup.page";
import { projectSetupBankDetailsErrorMap } from "@ui/containers/pages/projects/setup/projectSetupBankDetails.zod";
import { UpdatePartnerCommand } from "@server/features/partners/updatePartnerCommand";
import {
  ProjectSetupBankStatementParams,
  ProjectSetupBankStatementRoute,
} from "@ui/containers/pages/projects/setup/projectSetupBankStatement.page";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { BankDetailsTaskStatus } from "@framework/constants/partner";

const schema = z.object({
  form: z.literal(FormTypes.ProjectSetupBankStatement),
});

type BankStatementSchema = typeof schema;

export class ProjectSetupBankStatementHandler extends ZodFormHandlerBase<
  BankStatementSchema,
  ProjectSetupBankStatementParams
> {
  public readonly acceptFiles = false;
  constructor() {
    super({
      routes: [ProjectSetupBankStatementRoute],
      forms: [FormTypes.ProjectSetupBankStatement],
    });
  }

  protected async getZodSchema() {
    return {
      schema: schema,
      errorMap: projectSetupBankDetailsErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<BankStatementSchema>> {
    return {
      form: input.form,
    };
  }
  protected async run({
    params,
    context,
  }: {
    params: ProjectSetupBankStatementParams;
    context: IContext;
  }): Promise<string> {
    await context.runCommand(
      // Attempt to update the partner information.
      // Will crash and burn if there are validation errors,
      // which will return to the current page as expected.
      new UpdatePartnerCommand({
        projectId: params.projectId,
        id: params.partnerId,
        bankDetailsTaskStatus: BankDetailsTaskStatus.Complete,
      }),
    );

    return ProjectSetupRoute.getLink(params).path;
  }
}
