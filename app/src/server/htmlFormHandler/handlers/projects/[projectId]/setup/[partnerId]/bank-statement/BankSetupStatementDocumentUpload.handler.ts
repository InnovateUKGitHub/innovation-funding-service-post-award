import { IContext } from "@framework/types/IContext";
import { ServerFileWrapper } from "@server/apis/controllerBase";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { z } from "zod";
import {
  documentsErrorMap,
  getBankStatementUpload,
  UploadBankStatementSchemaType,
} from "@ui/zod/documentValidators.zod";
import express from "express";
import { FormTypes } from "@ui/zod/FormTypes";
import { configuration } from "@server/features/common/config";
import {
  ProjectSetupBankStatementParams,
  ProjectSetupBankStatementRoute,
} from "@ui/containers/pages/projects/setup/projectSetupBankStatement.page";
import { UploadPartnerDocumentCommand } from "@server/features/documents/uploadPartnerDocument";

class BankSetupStatementDocumentUploadHandler extends ZodFormHandlerBase<
  UploadBankStatementSchemaType,
  ProjectSetupBankStatementParams
> {
  constructor() {
    super({
      routes: [ProjectSetupBankStatementRoute],
      forms: [FormTypes.ProjectSetupBankStatementUpload],
    });
  }

  public readonly acceptFiles = true;

  protected async getZodSchema() {
    return { schema: getBankStatementUpload(configuration.options), errorMap: documentsErrorMap };
  }

  protected async mapToZod({
    input,
    files,
  }: {
    input: AnyObject;
    files: ServerFileWrapper[];
  }): Promise<z.input<UploadBankStatementSchemaType>> {
    return {
      form: input.form,
      files,
      description: input.description,
      projectId: input.projectId,
      partnerId: input.partnerId,
    };
  }

  protected async run({
    res,
    params,
    input,
    context,
  }: {
    res: express.Response;
    params: ProjectSetupBankStatementParams;
    input: z.output<UploadBankStatementSchemaType>;
    context: IContext;
  }): Promise<void> {
    await context.runCommand(new UploadPartnerDocumentCommand(params.projectId, params.partnerId, input));

    const message = this.copy.getCopyString(x =>
      x.forms.documents.files.messages.uploadedDocuments({ count: input.files.length }),
    );

    Array.isArray(res.locals.messages) ? res.locals.messages.push(message) : (res.locals.messages = [message]);
  }
}

export { BankSetupStatementDocumentUploadHandler };
