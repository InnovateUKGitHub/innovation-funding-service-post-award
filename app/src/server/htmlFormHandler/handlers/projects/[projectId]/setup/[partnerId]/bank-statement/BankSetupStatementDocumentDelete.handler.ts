import { IContext } from "@framework/types/IContext";

import { DeletePartnerDocumentCommand } from "@server/features/documents/deletePartnerDocument";
import { mapToDocumentSummaryDto } from "@server/features/documents/mapToDocumentSummaryDto";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import {
  ProjectSetupBankStatementParams,
  ProjectSetupBankStatementRoute,
} from "@ui/containers/pages/projects/setup/projectSetupBankStatement.page";
import { bankStatementDelete, BankStatementDeleteSchemaType, documentsErrorMap } from "@ui/zod/documentValidators.zod";
import { FormTypes } from "@ui/zod/FormTypes";
import express from "express";
import { z } from "zod";

class BankSetupStatementDocumentDeleteHandler extends ZodFormHandlerBase<
  BankStatementDeleteSchemaType,
  ProjectSetupBankStatementParams
> {
  constructor() {
    super({
      routes: [ProjectSetupBankStatementRoute],
      forms: [FormTypes.ProjectSetupBankStatementDelete],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: bankStatementDelete,
      errorMap: documentsErrorMap,
    };
  }

  protected async mapToZod({
    input,
    params,
  }: {
    input: AnyObject;
    params: ProjectSetupBankStatementParams;
  }): Promise<z.input<BankStatementDeleteSchemaType>> {
    return {
      ...params,
      documentId: input.documentId ?? input.button_documentId,
      form: FormTypes.ProjectSetupBankStatementDelete,
    };
  }

  protected async run({
    res,
    input,
    context,
    params,
  }: {
    res: express.Response;
    input: z.output<BankStatementDeleteSchemaType>;
    context: IContext;
    params: ProjectSetupBankStatementParams;
  }): Promise<void> {
    const [documentInfo] = await context.repositories.documents.getDocumentsMetadata([input.documentId]);

    const fileExists = typeof documentInfo !== "undefined";

    if (fileExists) {
      await context.runCommand(new DeletePartnerDocumentCommand(params.projectId, params.partnerId, input.documentId));
    }

    const deletedFileName = fileExists ? mapToDocumentSummaryDto(documentInfo, "")?.fileName : undefined;

    if (deletedFileName) {
      const message = this.copy.getCopyString(x =>
        x.forms.documents.files.messages.deletedDocument({ deletedFileName }),
      );

      Array.isArray(res.locals.messages) ? res.locals.messages.push(message) : (res.locals.messages = [message]);
    }
  }
}

export { BankSetupStatementDocumentDeleteHandler };
