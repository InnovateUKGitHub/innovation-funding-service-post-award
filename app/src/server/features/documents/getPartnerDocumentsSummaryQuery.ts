import { Authorisation, ProjectRole } from "@framework/types";
import { DocumentEntity } from "@framework/entities/document";
import { DocumentsSummaryQueryBase } from "./documentsSummaryQueryBase";

export class GetPartnerDocumentsQuery extends DocumentsSummaryQueryBase {
  constructor(private readonly projectId: string, private readonly partnerId: string) {
    super();
  }

  protected async accessControl(auth: Authorisation): Promise<boolean> {
    return auth.forPartner(this.projectId, this.partnerId).hasRole(ProjectRole.FinancialContact);
  }

  protected getRecordId(): Promise<string> {
    return Promise.resolve(this.partnerId);
  }

  protected getUrl(document: DocumentEntity): string {
    return `/api/documents/partners/${this.projectId}/${this.partnerId}/${document.id}/content`;
  }
}
