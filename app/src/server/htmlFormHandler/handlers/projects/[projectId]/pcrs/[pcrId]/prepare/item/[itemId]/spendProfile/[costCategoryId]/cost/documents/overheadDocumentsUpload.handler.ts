import { IContext } from "@framework/types/IContext";
import { ServerFileWrapper } from "@server/apis/controllerBase";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { z } from "zod";
import {
  documentsErrorMap,
  getOverheadDocumentUpload,
  OverheadDocumentUploadSchemaType,
} from "@ui/zod/documentValidators.zod";
import express from "express";
import { FormTypes } from "@ui/zod/FormTypes";
import { configuration } from "@server/features/common/config";
import {
  OverheadDocumentsPageParams,
  PCRSpendProfileOverheadDocumentRoute,
} from "@ui/pages/pcrs/addPartner/spendProfile/overheadDocumentContainer.page";
import { UploadProjectChangeRequestDocumentOrItemDocumentCommand } from "@server/features/documents/uploadProjectChangeRequestDocumentOrItemDocument";

class OverheadDocumentsUploadHandler extends ZodFormHandlerBase<
  OverheadDocumentUploadSchemaType,
  OverheadDocumentsPageParams
> {
  constructor() {
    super({
      routes: [PCRSpendProfileOverheadDocumentRoute],
      forms: [FormTypes.PcrAddPartnerSpendProfileOverheadDocumentsUpload],
    });
  }

  public readonly acceptFiles = true;

  protected async getZodSchema() {
    return { schema: getOverheadDocumentUpload({ config: configuration.options }), errorMap: documentsErrorMap };
  }

  protected async mapToZod({
    input,
    files,
  }: {
    input: AnyObject;
    files: ServerFileWrapper[];
  }): Promise<z.input<OverheadDocumentUploadSchemaType>> {
    return {
      form: FormTypes.PcrAddPartnerSpendProfileOverheadDocumentsUpload,
      files,
      description: input.description,
      projectId: input.projectId,
      projectChangeRequestIdOrItemId: input.projectChangeRequestIdOrItemId,
    };
  }

  protected async run({
    res,
    input,
    context,
  }: {
    res: express.Response;
    input: z.output<OverheadDocumentUploadSchemaType>;
    context: IContext;
  }): Promise<void> {
    await context.runCommand(
      new UploadProjectChangeRequestDocumentOrItemDocumentCommand(
        input.projectId,
        input.projectChangeRequestIdOrItemId,
        input,
      ),
    );

    const message = this.copy.getCopyString(x =>
      x.forms.documents.files.messages.uploadedDocuments({ count: input.files.length }),
    );

    Array.isArray(res.locals.messages) ? res.locals.messages.push(message) : (res.locals.messages = [message]);
  }
}

export { OverheadDocumentsUploadHandler };
