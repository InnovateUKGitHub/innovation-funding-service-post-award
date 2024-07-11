import { IContext } from "@framework/types/IContext";
import { DeleteClaimDocumentCommand } from "@server/features/documents/deleteClaimDocument";
import { mapToDocumentSummaryDto } from "@server/features/documents/mapToDocumentSummaryDto";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { ReviewClaimRoute } from "@ui/containers/pages/claims/claimReview/claimReview.page";
import {
  ClaimDocumentsPageParams,
  ClaimDocumentsRoute,
} from "@ui/containers/pages/claims/documents/ClaimDocuments.page";
import { claimLevelDelete, documentsErrorMap } from "@ui/zod/documentValidators.zod";
import { FormTypes } from "@ui/zod/FormTypes";
import express from "express";
import { z } from "zod";

class ClaimLevelDocumentShareDeleteHandler extends ZodFormHandlerBase<
  typeof claimLevelDelete,
  { projectId: ProjectId; partnerId: PartnerId; periodId: PeriodId }
> {
  constructor() {
    super({
      routes: [ClaimDocumentsRoute, ReviewClaimRoute],
      forms: [FormTypes.ClaimLevelDelete, FormTypes.ClaimReviewLevelDelete],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: claimLevelDelete,
      errorMap: documentsErrorMap,
    };
  }

  protected async mapToZod({
    input,
    params,
  }: {
    input: AnyObject;
    params: ClaimDocumentsPageParams;
  }): Promise<z.input<typeof claimLevelDelete>> {
    return {
      ...params,
      documentId: input.documentId ?? input.button_documentId,
      form: FormTypes.ClaimLevelDelete,
    };
  }

  protected async run({
    res,
    input,
    context,
  }: {
    res: express.Response;
    input: z.output<typeof claimLevelDelete>;
    context: IContext;
  }): Promise<void> {
    const [documentInfo] = await context.repositories.documents.getDocumentsMetadata([input.documentId]);

    const fileExists = typeof documentInfo !== "undefined";

    if (fileExists) {
      await context.runCommand(
        new DeleteClaimDocumentCommand(input.documentId, {
          projectId: input.projectId,
          partnerId: input.partnerId,
          periodId: input.periodId,
        }),
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

export { ClaimLevelDocumentShareDeleteHandler };
