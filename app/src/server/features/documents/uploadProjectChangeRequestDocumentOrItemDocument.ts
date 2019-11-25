import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { CommandBase, ValidationError } from "@server/features/common";
import { GetProjectChangeRequestDocumentOrItemDocumentQuery } from "@server/features/documents/getProjectChangeRequestDocumentOrItemDocument";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators";
// Uses either project change request Id or project change request item Id, as both cn be used as the entity Id of the document

export class UploadProjectChangeRequestDocumentOrItemDocumentCommand extends CommandBase<string[]> {
  constructor(private readonly projectId: string, private readonly projectChangeRequestIdOrItemId: string, private readonly documents: MultipleDocumentUploadDto) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    const projectChangeRequestExists = await context.repositories.projectChangeRequests.isExisting(this.projectId, this.projectChangeRequestIdOrItemId);
    if (!projectChangeRequestExists) return false;

    return auth.forProject(this.projectId).hasRole(ProjectRole.ProjectManager);
  }

  protected async Run(context: IContext) {
    const result = new MultipleDocumentUpdloadDtoValidator(this.documents, context.config, true, true);

    if (!result.isValid) {
      throw new ValidationError(result);
    }

    const results: string[] = [];

    for (const document of this.documents.files.filter(x => x.fileName && x.size)) {
      const id = await context.repositories.documents.insertDocument(document, this.projectChangeRequestIdOrItemId);
      results.push(id);
    }

    return results;
  }
}
