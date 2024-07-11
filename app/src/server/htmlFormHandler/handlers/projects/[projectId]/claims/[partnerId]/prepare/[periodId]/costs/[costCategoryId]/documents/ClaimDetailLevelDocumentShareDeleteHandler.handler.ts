import { IContext } from "@framework/types/IContext";
import { DeleteClaimDetailDocumentCommand } from "@server/features/documents/deleteClaimDetailDocument";
import { mapToDocumentSummaryDto } from "@server/features/documents/mapToDocumentSummaryDto";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import {
  ClaimDetailDocumentsRoute,
  ClaimDetailDocumentsPageParams,
} from "@ui/containers/pages/claims/claimDetailDocuments.page";
import { claimDetailLevelDelete, documentsErrorMap } from "@ui/zod/documentValidators.zod";
import { FormTypes } from "@ui/zod/FormTypes";
import express from "express";
import { z } from "zod";

class ClaimDetailLevelDocumentShareDeleteHandler extends ZodFormHandlerBase<
  typeof claimDetailLevelDelete,
  { projectId: ProjectId; partnerId: PartnerId; periodId: PeriodId; costCategoryId: CostCategoryId }
> {
  constructor() {
    super({
      routes: [ClaimDetailDocumentsRoute],
      forms: [FormTypes.ClaimDetailLevelDelete],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: claimDetailLevelDelete,
      errorMap: documentsErrorMap,
    };
  }

  protected async mapToZod({
    input,
    params,
  }: {
    input: AnyObject;
    params: ClaimDetailDocumentsPageParams;
  }): Promise<z.input<typeof claimDetailLevelDelete>> {
    return {
      ...params,
      documentId: input.documentId ?? input.button_documentId,
      form: FormTypes.ClaimDetailLevelDelete,
    };
  }

  protected async run({
    res,
    input,
    context,
  }: {
    res: express.Response;
    input: z.output<typeof claimDetailLevelDelete>;
    context: IContext;
  }): Promise<void> {
    const [documentInfo] = await context.repositories.documents.getDocumentsMetadata([input.documentId]);

    const documentSummaryInfo = mapToDocumentSummaryDto(documentInfo, "");
    await context.runCommand(
      new DeleteClaimDetailDocumentCommand(input.documentId, {
        projectId: input.projectId,
        partnerId: input.partnerId,
        periodId: input.periodId,
        costCategoryId: input.costCategoryId,
      }),
    );

    const message = this.copy.getCopyString(x =>
      x.forms.documents.files.messages.deletedDocument({ deletedFileName: documentSummaryInfo.fileName }),
    );

    Array.isArray(res.locals.messages) ? res.locals.messages.push(message) : (res.locals.messages = [message]);
  }
}

export { ClaimDetailLevelDocumentShareDeleteHandler };
