import { IContext } from "@framework/types/IContext";
import { ServerFileWrapper } from "@server/apis/controllerBase";
import { UploadProjectDocumentCommand } from "@server/features/documents/uploadProjectDocument";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { z } from "zod";
import { documentsErrorMap, getProjectLevelUpload, ProjectLevelUploadSchemaType } from "@ui/zod/documentValidators.zod";
import express from "express";
import { ProjectDocumentsRoute } from "@ui/pages/projects/documents/projectDocuments.page";
import { FormTypes } from "@ui/zod/FormTypes";
import { configuration } from "@server/features/common/config";

class ProjectLevelDocumentShareUploadHandler extends ZodFormHandlerBase<
  ProjectLevelUploadSchemaType,
  { projectId: ProjectId }
> {
  constructor() {
    super({
      routes: [ProjectDocumentsRoute],
      forms: [FormTypes.ProjectLevelUpload],
    });
  }

  public readonly acceptFiles = true;

  protected async getZodSchema() {
    return { schema: getProjectLevelUpload(configuration.options), errorMap: documentsErrorMap };
  }

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

    const message = this.copy.getCopyString(x =>
      x.forms.documents.files.messages.uploadedDocuments({ count: input.files.length }),
    );

    Array.isArray(res.locals.messages) ? res.locals.messages.push(message) : (res.locals.messages = [message]);
  }
}

export { ProjectLevelDocumentShareUploadHandler };
