import { IContext } from "@framework/types/IContext";
import { DeleteProjectDocumentCommand } from "@server/features/documents/deleteProjectDocument";
import { mapToDocumentSummaryDto } from "@server/features/documents/mapToDocumentSummaryDto";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { messageSuccess } from "@ui/redux/actions/common/messageActions";
import express from "express";
import { z } from "zod";
import { projectLevelDelete } from "@ui/zod/documentValidators.zod";
import {
  ProjectDocumentsRoute,
  ProjectDocumentPageParams,
} from "@ui/containers/pages/projects/documents/projectDocuments.page";

class ProjectLevelDocumentShareDeleteHandler extends ZodFormHandlerBase<
  typeof projectLevelDelete,
  { projectId: ProjectId }
> {
  constructor() {
    super({
      zod: projectLevelDelete,
      route: ProjectDocumentsRoute,
      forms: ["projectLevelDelete"],
      formIntlKeyPrefix: ["documents"],
    });
  }

  acceptFiles = true;

  protected async mapToZod({
    input,
    params,
  }: {
    input: AnyObject;
    params: ProjectDocumentPageParams;
  }): Promise<z.input<typeof projectLevelDelete>> {
    return {
      form: "projectLevelDelete" as const,
      documentId: input.documentId ?? input.button_documentId,
      projectId: params.projectId,
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
    input: z.output<typeof projectLevelDelete>;
    context: IContext;
  }): Promise<void> {
    const [documentInfo] = await context.repositories.documents.getDocumentsMetadata([input.documentId]);

    const documentSummaryInfo = mapToDocumentSummaryDto(documentInfo, "");
    await context.runCommand(new DeleteProjectDocumentCommand(input.projectId, input.documentId));

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
