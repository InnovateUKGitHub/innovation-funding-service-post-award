import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { DocumentQueryBase } from "./documentQueryBase";

export class GetPartnerDocumentQuery extends DocumentQueryBase {
  constructor(private readonly projectId: string, private readonly partnerId: string, documentId: string) {
    super(documentId);
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forPartner(this.projectId, this.partnerId).hasRole(ProjectRole.FinancialContact);
  }

  protected getRecordId(context: IContext): Promise<string | null> {
    return Promise.resolve(this.partnerId);
  }
}
