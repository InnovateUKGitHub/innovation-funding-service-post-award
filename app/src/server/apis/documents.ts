import { ControllerBase, ISession } from "./controllerBase";
import { DocumentDto, DocumentSummaryDto } from "../../ui/models";
import contextProvider from "../features/common/contextProvider";
import { GetClaimDetailDocumentsQuery } from "../features/documents/getClaimDetailDocuments";
import { GetDocumentQuery } from "../features/documents/getDocument";

export interface IDocumentsApi {
  getClaimDetailDocuments: (params: { partnerId: string, periodId: number, costCategoryId: string } & ISession) => Promise<DocumentSummaryDto[]>;
}

class Controller extends ControllerBase<DocumentSummaryDto> implements IDocumentsApi {
  constructor() {
    super("documents");

    this.getItems(
      "/claim-details/:partnerId/:periodId/:costCategoryId",
      (p) => ({ partnerId: p.partnerId, periodId: p.periodId, costCategoryId: p.costCategoryId }),
      p => this.getClaimDetailDocuments(p));

    this.getAttachment("/:documentId/content", (p) => ({ documentId: p.documentId }), p => this.getDocument(p));
  }

  public async getClaimDetailDocuments(params: { partnerId: string, periodId: number, costCategoryId: string} & ISession) {
    const { partnerId, periodId, costCategoryId, user} = params;
    const query = new GetClaimDetailDocumentsQuery(partnerId, periodId, costCategoryId);
    return await contextProvider.start(user).runQuery(query);
  }

  public async getDocument(params: { documentId: string } & ISession): Promise<DocumentDto> {
    const {documentId, user} = params;
    const query = new GetDocumentQuery(documentId);
    return await contextProvider.start(user).runQuery(query);
  }
}

export const controller = new Controller();
