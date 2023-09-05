import { IContext } from "@framework/types/IContext";
import { ServerFileWrapper } from "@server/apis/controllerBase";
import { UploadProjectDocumentCommand } from "@server/features/documents/uploadProjectDocument";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { z } from "zod";
import { getProjectLevelUpload, ProjectLevelUploadSchemaType } from "@ui/zod/documentValidators.zod";
import express from "express";
import { messageSuccess } from "@ui/redux/actions/common/messageActions";
import { ProjectDocumentsRoute } from "@ui/containers/pages/projects/documents/projectDocuments.page";
import { FormTypes } from "@ui/zod/FormTypes";
import { configuration } from "@server/features/common/config";

class ProjectLevelDocumentShareUploadHandler extends ZodFormHandlerBase<
  ProjectLevelUploadSchemaType,
  { projectId: ProjectId }
> {
  constructor() {
    super({
      zod: getProjectLevelUpload(configuration.options),
      route: ProjectDocumentsRoute,
      forms: [FormTypes.ProjectLevelUpload],
      formIntlKeyPrefix: ["documents"],
    });
  }

  public readonly acceptFiles = true;

  protected async mapToZod({
    input,
    files,
  }: {
    input: AnyObject;
    files: ServerFileWrapper[];
  }): Promise<z.input<ProjectLevelUploadSchemaType>> {
    return {
      form: FormTypes.ProjectLevelUpload,
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
    input: z.output<ProjectLevelUploadSchemaType>;
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
