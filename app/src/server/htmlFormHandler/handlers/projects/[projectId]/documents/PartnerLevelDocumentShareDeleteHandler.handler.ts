import { IContext } from "@framework/types/IContext";
import { DeletePartnerDocumentCommand } from "@server/features/documents/deletePartnerDocument";
import { mapToDocumentSummaryDto } from "@server/features/documents/mapToDocumentSummaryDto";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { messageSuccess } from "@ui/redux/actions/common/messageActions";
import express from "express";
import { z } from "zod";
import { partnerLevelDelete } from "@ui/zod/documentValidators.zod";
import {
  ProjectDocumentsRoute,
  ProjectDocumentPageParams,
} from "@ui/containers/pages/projects/documents/projectDocuments.page";
import { FormTypes } from "@ui/zod/FormTypes";

class PartnerLevelDocumentShareDeleteHandler extends ZodFormHandlerBase<
  typeof partnerLevelDelete,
  { projectId: ProjectId }
> {
  constructor() {
    super({
      route: ProjectDocumentsRoute,
      forms: [FormTypes.PartnerLevelDelete],
      formIntlKeyPrefix: ["documents"],
    });
  }

  acceptFiles = true;

  protected async getZodSchema() {
    return partnerLevelDelete;
  }

  protected async mapToZod({
    input,
    params,
  }: {
    input: AnyObject;
    params: ProjectDocumentPageParams;
  }): Promise<z.input<typeof partnerLevelDelete>> {
    return {
      form: FormTypes.PartnerLevelDelete,
      documentId: input.documentId ?? input.button_documentId,
      projectId: params.projectId,
      partnerId: input.partnerId,
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
    input: z.output<typeof partnerLevelDelete>;
    context: IContext;
  }): Promise<void> {
    const [documentInfo] = await context.repositories.documents.getDocumentsMetadata([input.documentId]);
    const documentSummaryInfo = mapToDocumentSummaryDto(documentInfo, "");
    await context.runCommand(new DeletePartnerDocumentCommand(input.projectId, input.partnerId, input.documentId));

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

export { PartnerLevelDocumentShareDeleteHandler };
