import { IContext } from "@framework/types/IContext";
import { ServerFileWrapper } from "@server/apis/controllerBase";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { z } from "zod";
import { PcrLevelUploadSchemaType, documentsErrorMap, getPcrLevelUpload } from "@ui/zod/documentValidators.zod";
import express from "express";
import { FormTypes } from "@ui/zod/FormTypes";
import { configuration } from "@server/features/common/config";
import {
  PCRPrepareReasoningRoute,
  ProjectChangeRequestPrepareReasoningParams,
} from "@ui/containers/pages/pcrs/reasoning/pcrReasoningWorkflow.page";
import { UploadProjectChangeRequestDocumentOrItemDocumentCommand } from "@server/features/documents/uploadProjectChangeRequestDocumentOrItemDocument";

export class ProjectChangeRequestReasoningDocumentUploadHandler extends ZodFormHandlerBase<
  PcrLevelUploadSchemaType,
  ProjectChangeRequestPrepareReasoningParams
> {
  constructor() {
    super({
      routes: [PCRPrepareReasoningRoute],
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

    const message = this.copy.getCopyString(x =>
      x.forms.documents.files.messages.uploadedDocuments({ count: input.files.length }),
    );

    Array.isArray(res.locals.messages) ? res.locals.messages.push(message) : (res.locals.messages = [message]);
  }
}
