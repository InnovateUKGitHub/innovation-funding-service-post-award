import { QueryBase } from "@server/features/common";
import { Authorisation, IContext, ProjectRole } from "@framework/types";

export class GetClaimDocumentQuery extends QueryBase<DocumentDto | null> {
  constructor(private readonly claimKey: ClaimKey, private documentId: string) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return auth.forPartner(this.claimKey.projectId, this.claimKey.partnerId).hasRole(ProjectRole.FinancialContact)
    || auth.forProject(this.claimKey.projectId).hasRole(ProjectRole.MonitoringOfficer);
}

  protected async Run(context: IContext) {

    const claim = await context.repositories.claims.get(this.claimKey.partnerId, this.claimKey.periodId);

    const metaData = await context.repositories.documents.getDocumentMetadataForEntityDocument(claim.Id, this.documentId);
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
