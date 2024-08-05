import { ProjectRole } from "@framework/constants/project";
import { DocumentEntity } from "@framework/entities/document";
import { Authorisation } from "@framework/types/authorisation";
import { DocumentsSummaryQueryBase } from "./documentsSummaryQueryBase";

export class GetPartnerDocumentsQuery extends DocumentsSummaryQueryBase {
  public readonly runnableName: string = "GetPartnerDocumentsQuery";
  constructor(
    private readonly projectId: ProjectId,
    private readonly partnerId: PartnerId,
  ) {
    super();
  }

  async accessControl(auth: Authorisation): Promise<boolean> {
    return auth.forPartner(this.projectId, this.partnerId).hasRole(ProjectRole.FinancialContact);
  }

  protected getRecordId(): Promise<string> {
    return Promise.resolve(this.partnerId);
  }

  protected getUrl(document: DocumentEntity): string {
    return `/api/documents/partners/${this.projectId}/${this.partnerId}/${document.id}/content`;
  }
}
