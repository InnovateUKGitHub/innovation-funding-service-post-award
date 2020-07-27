import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { DocumentsSummaryQueryBase } from "./documentsSummaryQueryBase";
import { DocumentEntity } from "@framework/entities/document";

export class GetPartnerDocumentsQuery extends DocumentsSummaryQueryBase {
  constructor(private readonly projectId: string, private readonly partnerId: string) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forPartner(this.projectId, this.partnerId).hasRole(ProjectRole.FinancialContact);
  }

  protected getRecordId(context: IContext) {
    return Promise.resolve(this.partnerId);
  }

  protected getUrl(document: DocumentEntity) {
    return `/api/documents/partners/${this.projectId}/${this.partnerId}/${document.id}/content`;
  }
}
