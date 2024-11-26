import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { ProjectSetupRoute } from "@ui/pages/projects/setup/projectSetup.page";
import { UpdatePartnerCommand } from "@server/features/partners/updatePartnerCommand";
import {
  ProjectSetupBankStatementParams,
  ProjectSetupBankStatementRoute,
} from "@ui/pages/projects/setup/projectSetupBankStatement.page";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { BankDetailsTaskStatus } from "@framework/constants/partner";
import {
  BankStatementSchema,
  projectSetupBankStatementErrorMap,
  setupBankStatementSchema,
} from "@ui/pages/projects/setup/projectSetupBankStatement.zod";
import { GetPartnerDocumentsQuery } from "@server/features/documents/getPartnerDocumentsSummaryQuery";
import { DocumentDescription } from "@framework/constants/documentDescription";

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
      errorMap: projectSetupBankStatementErrorMap,
    };
  }

  protected async mapToZod({
    input,
    context,
    params,
  }: {
    input: AnyObject;
    context: IContext;
    params: ProjectSetupBankStatementParams;
  }): Promise<z.input<BankStatementSchema>> {
    const documents = await context.runQuery(new GetPartnerDocumentsQuery(params.projectId, params.partnerId));
    const hasUploadedBankStatement = documents.some(doc => doc.description === DocumentDescription.BankStatement);

    return {
      form: input.form,
      hasUploadedBankStatement,
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
