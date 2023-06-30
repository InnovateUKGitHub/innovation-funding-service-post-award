import { IContext } from "@framework/types/IContext";
import { ServerFileWrapper } from "@server/apis/controllerBase";
import { UploadProjectDocumentCommand } from "@server/features/documents/uploadProjectDocument";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { z } from "zod";
import { projectLevelUpload } from "@ui/zod/documentValidators.zod";
import express from "express";
import { messageSuccess } from "@ui/redux/actions/common/messageActions";
import { ProjectDocumentsRoute } from "@ui/containers/pages/projects/documents/projectDocuments.page";

class ProjectLevelDocumentShareUploadHandler extends ZodFormHandlerBase<
  typeof projectLevelUpload,
  { projectId: ProjectId }
> {
  constructor() {
    super({
      zod: projectLevelUpload,
      route: ProjectDocumentsRoute,
      forms: ["projectLevelUpload"],
      formIntlKeyPrefix: ["documents"],
    });
  }

  acceptFiles = true;

  protected async mapToZod({
    input,
    files,
  }: {
    input: AnyObject;
    files: ServerFileWrapper[];
  }): Promise<z.input<typeof projectLevelUpload>> {
    return {
      form: "projectLevelUpload" as const,
      files,
      description: input.description,
      projectId: input.projectId,
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
    input: z.output<typeof projectLevelUpload>;
    context: IContext;
  }): Promise<void> {
    await context.runCommand(new UploadProjectDocumentCommand(input.projectId, input));

    // TODO: Actually use Redux instead of a temporary array
    res.locals.preloadedReduxActions.push(
      messageSuccess(
        this.copy.getCopyString(x => x.forms.documents.files.messages.uploadedDocuments({ count: input.files.length })),
      ),
    );
  }
}

export { ProjectLevelDocumentShareUploadHandler };
