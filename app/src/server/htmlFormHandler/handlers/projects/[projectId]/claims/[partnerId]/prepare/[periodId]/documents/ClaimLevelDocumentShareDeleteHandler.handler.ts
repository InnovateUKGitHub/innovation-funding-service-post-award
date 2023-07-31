import { IContext } from "@framework/types/IContext";
import { DeleteClaimDocumentCommand } from "@server/features/documents/deleteClaimDocument";
import { mapToDocumentSummaryDto } from "@server/features/documents/mapToDocumentSummaryDto";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import {
  ClaimDocumentsPageParams,
  ClaimDocumentsRoute,
} from "@ui/containers/pages/claims/documents/ClaimDocuments.page";
import { messageSuccess } from "@ui/redux/actions/common/messageActions";
import { claimLevelDelete } from "@ui/zod/documentValidators.zod";
import { FormTypes } from "@ui/zod/FormTypes";
import express from "express";
import { z } from "zod";

class ClaimLevelDocumentShareDeleteHandler extends ZodFormHandlerBase<
  typeof claimLevelDelete,
  { projectId: ProjectId; partnerId: PartnerId; periodId: PeriodId }
> {
  constructor() {
    super({
      zod: claimLevelDelete,
      route: ClaimDocumentsRoute,
      forms: [FormTypes.ClaimLevelDelete],
      formIntlKeyPrefix: ["documents"],
    });
  }

  acceptFiles = true;

  protected async mapToZod({
    input,
    params,
  }: {
    input: AnyObject;
    params: ClaimDocumentsPageParams;
  }): Promise<z.input<typeof claimLevelDelete>> {
    return {
      form: FormTypes.ClaimLevelDelete,
      documentId: input.documentId ?? input.button_documentId,
      projectId: params.projectId,
      partnerId: params.partnerId,
      periodId: params.periodId,
    };
  }

  protected async mapToRedirect() {
    return null;
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

    const documentSummaryInfo = mapToDocumentSummaryDto(documentInfo, "");
    await context.runCommand(
      new DeleteClaimDocumentCommand(input.documentId, {
        projectId: input.projectId,
        partnerId: input.partnerId,
        periodId: input.periodId,
      }),
    );

    // TODO: Actually use Redux instead of a temporary array
    res.locals.preloadedReduxActions.push(
      messageSuccess(
        this.copy.getCopyString(x =>
          x.forms.documents.files.messages.deletedDocument({ deletedFileName: documentSummaryInfo.fileName }),
        ),
      ),
    );
  }
}

export { ClaimLevelDocumentShareDeleteHandler };
