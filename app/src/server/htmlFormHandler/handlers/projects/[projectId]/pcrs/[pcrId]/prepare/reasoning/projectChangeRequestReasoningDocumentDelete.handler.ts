import { IContext } from "@framework/types/IContext";
import { DeleteProjectChangeRequestDocumentOrItemDocument } from "@server/features/documents/deleteProjectChangeRequestDocumentOrItemDocument";
import { mapToDocumentSummaryDto } from "@server/features/documents/mapToDocumentSummaryDto";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import {
  PCRPrepareReasoningRoute,
  ProjectChangeRequestPrepareReasoningParams,
} from "@ui/pages/pcrs/reasoning/pcrReasoningWorkflow.page";
import { documentsErrorMap, pcrLevelDelete } from "@ui/zod/documentValidators.zod";
import { FormTypes } from "@ui/zod/FormTypes";
import express from "express";
import { z } from "zod";

export class ProjectChangeRequestReasoningDocumentDeleteHandler extends ZodFormHandlerBase<
  typeof pcrLevelDelete,
  ProjectChangeRequestPrepareReasoningParams
> {
  constructor() {
    super({
      routes: [PCRPrepareReasoningRoute],
      forms: [FormTypes.PcrLevelDelete],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: pcrLevelDelete,
      errorMap: documentsErrorMap,
    };
  }

  protected async mapToZod({
    input,
    params,
  }: {
    input: AnyObject;
    params: ProjectChangeRequestPrepareReasoningParams;
  }): Promise<z.input<typeof pcrLevelDelete>> {
    return {
      projectId: params.projectId,
      projectChangeRequestIdOrItemId: params.pcrId,
      documentId: input.documentId ?? input.button_documentId,
      form: FormTypes.PcrLevelDelete,
    };
  }

  protected async run({
    res,
    input,
    context,
  }: {
    res: express.Response;
    input: z.output<typeof pcrLevelDelete>;
    context: IContext;
  }): Promise<void> {
    const [documentInfo] = await context.repositories.documents.getDocumentsMetadata([input.documentId]);

    const documentSummaryInfo = mapToDocumentSummaryDto(documentInfo, "");
    await context.runCommand(
      new DeleteProjectChangeRequestDocumentOrItemDocument(
        input.documentId,
        input.projectId,
        input.projectChangeRequestIdOrItemId,
      ),
    );

    const message = this.copy.getCopyString(x =>
      x.forms.documents.files.messages.deletedDocument({ deletedFileName: documentSummaryInfo.fileName }),
    );

    Array.isArray(res.locals.messages) ? res.locals.messages.push(message) : (res.locals.messages = [message]);
  }
}
