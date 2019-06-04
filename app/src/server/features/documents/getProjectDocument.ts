import { QueryBase } from "@server/features/common";
import { Authorisation, IContext, ProjectRole } from "@framework/types";

export class GetProjectDocumentQuery extends QueryBase<DocumentDto | null> {
  constructor(private readonly projectId: string, private documentId: string) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return context.config.features.projectDocuments && auth.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  protected async Run(context: IContext) {

    const metaData = await context.repositories.documents.getDocumentMetadataForEntityDocument(this.projectId, this.documentId);
    if(!metaData) return null;

    const documentStream = await context.repositories.documents.getDocumentContent(this.documentId);
    if(!documentStream) return null;

    return {
      fileType: metaData.FileType,
      contentLength: metaData.ContentSize,
      stream: documentStream,
      fileName: metaData.FileExtension ? `${metaData.Title}.${metaData.FileExtension}` : metaData.Title
    };
  }
}
