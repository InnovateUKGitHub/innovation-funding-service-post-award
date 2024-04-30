import { UploadLoanDocumentsCommand } from "@server/features/documents/uploadLoanDocument";
import { IContext } from "@framework/types/IContext";
import express from "express";
import { configuration } from "@server/features/common/config";
import { LoansRequestParams, LoansRequestRoute } from "@ui/containers/pages/loans/loanRequest.page";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { LoanLevelUploadSchemaType, documentsErrorMap, getLoanLevelUpload } from "@ui/zod/documentValidators.zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { ServerFileWrapper } from "@server/apis/controllerBase";
import { z } from "zod";
import { messageSuccess } from "@ui/redux/actions/common/messageActions";

export class LoanRequestDocumentUploadHandler extends ZodFormHandlerBase<
  LoanLevelUploadSchemaType,
  LoansRequestParams
> {
  constructor() {
    super({
      route: LoansRequestRoute,
      forms: [FormTypes.LoanLevelUpload],
    });
  }

  public readonly acceptFiles = true;

  protected async getZodSchema() {
    return {
      schema: getLoanLevelUpload({ config: configuration.options }),
      errorMap: documentsErrorMap,
    };
  }

  protected async mapToZod({
    input,
    files,
  }: {
    input: AnyObject;
    files: ServerFileWrapper[];
  }): Promise<z.input<LoanLevelUploadSchemaType>> {
    return {
      form: FormTypes.LoanLevelUpload,
      files,
      description: input.description,
      projectId: input.projectId,
      loanId: input.loanId,
    };
  }

  protected async run({
    res,
    input,
    context,
  }: {
    res: express.Response;
    input: z.output<LoanLevelUploadSchemaType>;
    context: IContext;
  }): Promise<void> {
    await context.runCommand(new UploadLoanDocumentsCommand(input, input.projectId, input.loanId));

    // TODO: Actually use Redux instead of a temporary array
    res.locals.preloadedReduxActions.push(
      messageSuccess(
        this.copy.getCopyString(x => x.forms.documents.files.messages.uploadedDocuments({ count: input.files.length })),
      ),
    );
  }
}
