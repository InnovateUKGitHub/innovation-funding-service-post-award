import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { ProjectSetupRoute } from "@ui/pages/projects/setup/projectSetup.page";
import { projectSetupBankDetailsErrorMap } from "@ui/pages/projects/setup/projectSetupBankDetails.zod";
import { UpdatePartnerCommand } from "@server/features/partners/updatePartnerCommand";
import {
  ProjectSetupBankStatementParams,
  ProjectSetupBankStatementRoute,
} from "@ui/pages/projects/setup/projectSetupBankStatement.page";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { BankDetailsTaskStatus } from "@framework/constants/partner";
import { BankStatementSchema, setupBankStatementSchema } from "@ui/pages/projects/setup/projectSetupBankStatement.zod";

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
      schema: setupBankStatementSchema,
      errorMap: projectSetupBankDetailsErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<BankStatementSchema>> {
    return {
      form: input.form,
    };
  }
  protected async run({
    input,
    params,
    context,
  }: {
    input: z.output<BankStatementSchema>;
    params: ProjectSetupBankStatementParams;
    context: IContext;
  }): Promise<string> {
    await context.runCommand(
      // Attempt to update the partner information.
      // Will crash and burn if there are validation errors,
      // which will return to the current page as expected.

      new UpdatePartnerCommand(
        {
          projectId: params.projectId,
          id: params.partnerId,
          bankDetailsTaskStatus: BankDetailsTaskStatus.Complete,
        },
        input.form,
      ),
    );

    return ProjectSetupRoute.getLink(params).path;
  }
}
