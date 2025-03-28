import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { ProjectSetupRoute } from "@ui/pages/projects/setup/projectSetup.page";
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
import { BankDetailsTaskStatusMapper } from "@framework/mappers/bankTaskStatus";

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
    params,
    context,
  }: {
    params: ProjectSetupBankStatementParams;
    context: IContext;
  }): Promise<string> {
    await context.repositories.partners.update({
      Id: params.partnerId,
      Acc_BankCheckCompleted__c: new BankDetailsTaskStatusMapper().mapToSalesforce(BankDetailsTaskStatus.Complete),
    });

    return ProjectSetupRoute.getLink(params).path;
  }
}
