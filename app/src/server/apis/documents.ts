import { ApiParams, ControllerBase } from "./controllerBase";
import contextProvider from "../features/common/contextProvider";
import { GetClaimDetailDocumentsQuery } from "../features/documents/getClaimDetailDocuments";
import { GetDocumentQuery } from "../features/documents/getDocument";
import { UploadClaimDetailDocumentCommand } from "../features/documents/uploadClaimDetailDocument";

export interface IDocumentsApi {
  getClaimDetailDocuments: (params: ApiParams<{ partnerId: string, periodId: number, costCategoryId: string }>) => Promise<DocumentSummaryDto[]>;
}

class Controller extends ControllerBase<DocumentSummaryDto> implements IDocumentsApi {
  constructor() {
    super("documents");

    this.getItems(
      "/claim-details/:partnerId/:periodId/:costCategoryId",
      (p) => ({ partnerId: p.partnerId, periodId: p.periodId, costCategoryId: p.costCategoryId }),
      p => this.getClaimDetailDocuments(p)
    );

    this.getAttachment(
      "/:documentId/content",
      (p) => ({ documentId: p.documentId }),
        p => this.getDocument(p)
    );

    this.postAttachment(
      "/claim-details/:partnerId/:periodId/:costCategoryId",
      (p, q, b, f) => ({ claimDetailKey: { partnerId: p.partnerId, periodId: p.periodId, costCategoryId: p.costCategoryId, file: f }, file: f }),
      p => this.uploadClaimDetailDocument(p)
    );
  }

  public async getClaimDetailDocuments(params: ApiParams<{ partnerId: string, periodId: number, costCategoryId: string }>) {
    const { partnerId, periodId, costCategoryId } = params;
    const query = new GetClaimDetailDocumentsQuery(partnerId, periodId, costCategoryId);
    return await contextProvider.start(params).runQuery(query);
  }

  public async getDocument(params: ApiParams<{ documentId: string }>): Promise<DocumentDto> {
    const { documentId } = params;
    const query = new GetDocumentQuery(documentId);
    return await contextProvider.start(params).runQuery(query);
  }

  public async uploadClaimDetailDocument(params: ApiParams<{claimDetailKey: ClaimDetailKey, file: FileUpload}>) {
    const { claimDetailKey, file } = params;
    const query = new UploadClaimDetailDocumentCommand(claimDetailKey, file);
    return contextProvider.start(params).runQuery(query);
  }
}

export const controller = new Controller();
