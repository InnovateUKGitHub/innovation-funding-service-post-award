import { IContext } from "@framework/types/IContext";
import { DeleteProjectDocumentCommand } from "@server/features/documents/deleteProjectDocument";
import { mapToDocumentSummaryDto } from "@server/features/documents/mapToDocumentSummaryDto";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { messageSuccess } from "@ui/redux/actions/common/messageActions";
import express from "express";
import { z } from "zod";
import { documentsErrorMap, projectOrPartnerLevelDelete } from "@ui/zod/documentValidators.zod";
import {
  ProjectDocumentsRoute,
  ProjectDocumentPageParams,
} from "@ui/containers/pages/projects/documents/projectDocuments.page";
import { FormTypes } from "@ui/zod/FormTypes";
import { DeletePartnerDocumentCommand } from "@server/features/documents/deletePartnerDocument";

class ProjectLevelDocumentShareDeleteHandler extends ZodFormHandlerBase<
  typeof projectOrPartnerLevelDelete,
  { projectId: ProjectId }
> {
  constructor() {
    super({
      routes: [ProjectDocumentsRoute],
      forms: [FormTypes.ProjectLevelDelete, FormTypes.PartnerLevelDelete],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return { schema: projectOrPartnerLevelDelete, errorMap: documentsErrorMap };
  }

  protected async mapToZod({
    input,
    params,
  }: {
    input: AnyObject;
    params: ProjectDocumentPageParams;
  }): Promise<z.input<typeof projectOrPartnerLevelDelete>> {
    return {
      form: input.form,
      documentId: input.documentId ?? input.button_documentId,
      projectId: params.projectId,
      partnerId: input.partnerId,
    };
  }

  protected async run({
    res,
    input,
    context,
  }: {
    res: express.Response;
    input: z.output<typeof projectOrPartnerLevelDelete>;
    context: IContext;
  }): Promise<void> {
    const [documentInfo] = await context.repositories.documents.getDocumentsMetadata([input.documentId]);

    const documentSummaryInfo = mapToDocumentSummaryDto(documentInfo, "");

    if (input.form === FormTypes.PartnerLevelDelete) {
      await context.runCommand(new DeletePartnerDocumentCommand(input.projectId, input.partnerId, input.documentId));
    } else {
      await context.runCommand(new DeleteProjectDocumentCommand(input.projectId, input.documentId));
    }

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

export { ProjectLevelDocumentShareDeleteHandler };
