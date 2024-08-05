import { ProjectRole } from "@framework/constants/project";
import { AllPartnerDocumentSummaryDto } from "@framework/dtos/documentDto";
import { DocumentEntity } from "@framework/entities/document";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { Logger } from "@shared/developmentLogger";
import { ILogger } from "@shared/logger";
import { AuthorisedAsyncQueryBase } from "../common/queryBase";
import { GetAllProjectRolesForUser } from "../projects/getAllProjectRolesForUser";
import { mapToPartnerDocumentSummaryDto } from "./mapToDocumentSummaryDto";

export class GetAllPartnerDocumentsQuery extends AuthorisedAsyncQueryBase<AllPartnerDocumentSummaryDto> {
  public readonly runnableName: string = "GetAllPartnerDocumentsQuery";
  public logger: ILogger = new Logger("GetAllPartnerDocumentsQuery");

  constructor(private readonly projectId: ProjectId) {
    super();
  }

  async accessControl(auth: Authorisation): Promise<boolean> {
    return auth
      .forProject(this.projectId)
      .hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.FinancialContact, ProjectRole.ProjectManager);
  }

  protected getUrl(partnerId: PartnerId, document: DocumentEntity): string {
    return `/api/documents/partners/${this.projectId}/${partnerId}/${document.id}/content`;
  }

  protected async run(context: IContext): Promise<AllPartnerDocumentSummaryDto> {
    const partners = await context.repositories.partners.getAllByProjectId(this.projectId);
    const auth = await context.runQuery(new GetAllProjectRolesForUser());

    const documents: AllPartnerDocumentSummaryDto = [];

    const viewablePartners = partners.filter(
      partner =>
        auth.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer) ||
        auth
          .forPartner(this.projectId, partner.id)
          .hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager),
    );

    for (const partner of viewablePartners) {
      const linkedDocs = await context.repositories.documents.getDocumentsMetadataByLinkedRecord(partner.id);

      documents.push(...linkedDocs.map(x => mapToPartnerDocumentSummaryDto(x, this.getUrl(partner.id, x), partner)));
    }

    return documents;
  }
}
