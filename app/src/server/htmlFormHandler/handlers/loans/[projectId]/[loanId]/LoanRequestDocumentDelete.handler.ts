import { DeleteLoanDocument } from "@server/features/documents/deleteLoanDocument";
import { IContext } from "@framework/types/IContext";
import { LoansRequestParams, LoansRequestRoute } from "@ui/pages/loans/loanRequest.page";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { documentsErrorMap, loanLevelDelete } from "@ui/zod/documentValidators.zod";
import { FormTypes } from "@ui/zod/FormTypes";
import express from "express";
import { z } from "zod";
import { mapToDocumentSummaryDto } from "@server/features/documents/mapToDocumentSummaryDto";

export class LoanRequestDocumentDeleteHandler extends ZodFormHandlerBase<typeof loanLevelDelete, LoansRequestParams> {
  constructor() {
    super({
      routes: [LoansRequestRoute],
      forms: [FormTypes.LoanLevelDelete],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: loanLevelDelete,
      errorMap: documentsErrorMap,
    };
  }

  protected async mapToZod({
    input,
    params,
  }: {
    input: AnyObject;
    params: LoansRequestParams;
  }): Promise<z.input<typeof loanLevelDelete>> {
    return {
      ...params,
      documentId: input.documentId ?? input.button_documentId,
      form: FormTypes.LoanLevelDelete,
    };
  }

  protected async run({
    res,
    input,
    context,
  }: {
    res: express.Response;
    input: z.output<typeof loanLevelDelete>;
    context: IContext;
  }): Promise<void> {
    const [documentInfo] = await context.repositories.documents.getDocumentsMetadata([input.documentId]);

    const documentSummaryInfo = mapToDocumentSummaryDto(documentInfo, "");
    await context.runCommand(new DeleteLoanDocument(input.documentId, input.projectId, input.loanId));

    const message = this.copy.getCopyString(x =>
      x.forms.documents.files.messages.deletedDocument({ deletedFileName: documentSummaryInfo.fileName }),
    );

    Array.isArray(res.locals.messages) ? res.locals.messages.push(message) : (res.locals.messages = [message]);
  }
}
