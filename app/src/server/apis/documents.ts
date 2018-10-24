import {ControllerBase} from "./controllerBase";
import {DocumentDto, DocumentSummaryDto} from "../../ui/models";
import contextProvider from "../features/common/contextProvider";
import {GetClaimDetailDocumentsQuery} from "../features/documents/getClaimDetailDocuments";
import {GetDocumentQuery} from "../features/documents/getDocument";

export interface IDocumentsApi {
  getClaimDetailDocuments: (partnerId: string, periodId: number, costCategoryId: string) => Promise<DocumentSummaryDto[]>;
}

class Controller extends ControllerBase<DocumentSummaryDto> implements IDocumentsApi {
  constructor() {
    super("documents");

    this.getItems(
      "/claim-details/:partnerId/:periodId/:costCategoryId",
      (p) => ({ partnerId: p.partnerId, periodId: p.periodId, costCategoryId: p.costCategoryId }),
        p => this.getClaimDetailDocuments(p.partnerId, p.periodId, p.costCategoryId));

    this.getAttachment("/:documentId/content", (p) => ({ documentId: p.documentId }), p => this.getDocument(p.documentId));
  }

  public async getClaimDetailDocuments(partnerId: string, periodId: number, costCategoryId: string) {
    const query = new GetClaimDetailDocumentsQuery(partnerId, periodId, costCategoryId);
    return await contextProvider.start().runQuery(query);
  }

  public async getDocument(documentId: string): Promise<DocumentDto> {
    const query = new GetDocumentQuery(documentId);
    return await contextProvider.start().runQuery(query);
  }
}

export const controller = new Controller();
