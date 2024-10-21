import { IContext } from "@framework/types/IContext";
import { DeleteProjectChangeRequestDocumentOrItemDocument } from "@server/features/documents/deleteProjectChangeRequestDocumentOrItemDocument";
import express from "express";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import {
  OverheadDocumentsPageParams,
  PCRSpendProfileOverheadDocumentRoute,
} from "@ui/pages/pcrs/addPartner/spendProfile/overheadDocumentContainer.page";
import { FormTypes } from "@ui/zod/FormTypes";
import { pcrModifyErrorMap } from "@ui/zod/pcrValidator.zod";
import { mapToDocumentSummaryDto } from "@server/features/documents/mapToDocumentSummaryDto";
import { z } from "zod";

const deleteSchema = z.object({
  form: z.literal(FormTypes.PcrAddPartnerSpendProfileOverheadDocumentsDelete),
  documentId: z.string(),
});
type DeleteSchema = typeof deleteSchema;

class OverheadDocumentsDeleteHandler extends ZodFormHandlerBase<DeleteSchema, OverheadDocumentsPageParams> {
  constructor() {
    super({
      routes: [PCRSpendProfileOverheadDocumentRoute],
      forms: [FormTypes.PcrAddPartnerSpendProfileOverheadDocumentsDelete],
    });
  }

  acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: deleteSchema,
      errorMap: pcrModifyErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<DeleteSchema>> {
    return {
      form: input.form,
      documentId: input.documentId,
    };
  }

  protected async run({
    res,
    input,
    context,
    params,
  }: {
    res: express.Response;
    input: z.output<DeleteSchema>;
    params: OverheadDocumentsPageParams;
    context: IContext;
  }): Promise<void> {
    const [documentInfo] = await context.repositories.documents.getDocumentsMetadata([input.documentId]);

    const fileExists = typeof documentInfo !== "undefined";

    if (fileExists) {
      await context.runCommand(
        new DeleteProjectChangeRequestDocumentOrItemDocument(input.documentId, params.projectId, params.itemId),
      );
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

export { OverheadDocumentsDeleteHandler };
