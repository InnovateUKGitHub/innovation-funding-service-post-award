import { ApiParams, ControllerBase } from "./controllerBase";
import { DocumentDto, DocumentSummaryDto } from "../../ui/models";
import contextProvider from "../features/common/contextProvider";
import { GetClaimDetailDocumentsQuery } from "../features/documents/getClaimDetailDocuments";
import { GetDocumentQuery } from "../features/documents/getDocument";
import {UploadDocumentCommand} from "../features/documents/uploadDocument";
import {UploadClaimDetailDocumentCommand} from "../features/documents/uploadClaimDetailDocument";

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
      (p, q, b, f) => ({ partnerId: p.partnerId, periodId: p.periodId, costCategoryId: p.costCategoryId, file: f }),
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

  public async uploadClaimDetailDocument(params: ApiParams<{partnerId: string, periodId: number, costCategoryId: string, file: any}>) {
    const { partnerId, periodId, costCategoryId, file } = params;
    const claimDetailKey = {
      partnerId: partnerId,
      periodId: periodId,
      costCategoryId: costCategoryId,
    };
    const query = new UploadClaimDetailDocumentCommand(claimDetailKey, file.content, file.fileName);
    return await contextProvider.start(params).runQuery(query);
  }
}

export const controller = new Controller();
