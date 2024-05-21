import { IContext } from "@framework/types/IContext";
import { ServerFileWrapper } from "@server/apis/controllerBase";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { z } from "zod";
import { PcrLevelUploadSchemaType, documentsErrorMap, getPcrLevelUpload } from "@ui/zod/documentValidators.zod";
import express from "express";

import { FormTypes } from "@ui/zod/FormTypes";
import { configuration } from "@server/features/common/config";

import { UploadProjectChangeRequestDocumentOrItemDocumentCommand } from "@server/features/documents/uploadProjectChangeRequestDocumentOrItemDocument";
import {
  PCRPrepareItemRoute,
  ProjectChangeRequestPrepareItemParams,
} from "@ui/containers/pages/pcrs/pcrItemWorkflowContainer";

export class PcrItemLevelDocumentUploadHandler extends ZodFormHandlerBase<
  PcrLevelUploadSchemaType,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrLevelUpload],
    });
  }

  public readonly acceptFiles = true;

  protected async getZodSchema() {
    return {
      schema: getPcrLevelUpload({ config: configuration.options }),
      errorMap: documentsErrorMap,
    };
  }

  protected async mapToZod({
    input,
    files,
  }: {
    input: AnyObject;
    files: ServerFileWrapper[];
  }): Promise<z.input<PcrLevelUploadSchemaType>> {
    return {
      form: FormTypes.PcrLevelUpload,
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
    input: z.output<PcrLevelUploadSchemaType>;
    context: IContext;
  }): Promise<void> {
    await context.runCommand(
      new UploadProjectChangeRequestDocumentOrItemDocumentCommand(
        input.projectId,
        input.projectChangeRequestIdOrItemId,
        input,
      ),
    );

    res.locals.messages.push(
      this.copy.getCopyString(x => x.forms.documents.files.messages.uploadedDocuments({ count: input.files.length })),
    );
  }
}
