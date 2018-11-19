import { ApiParams, ControllerBase } from "./controllerBase";
import contextProvider from "../features/common/contextProvider";
import { GetClaimDetailDocumentsQuery } from "../features/documents/getClaimDetailDocuments";
import { GetDocumentQuery } from "../features/documents/getDocument";
import { UploadClaimDetailDocumentCommand } from "../features/documents/uploadClaimDetailDocument";
import { DeleteDocumentCommand } from "../features/documents/deleteDocument";
import { FileUpload } from "../../types/FileUpload";
import {GetClaimDocumentsQuery} from "../features/documents/getClaimDocuments";
import {DocumentDescription} from "../../types/constants";

export interface IDocumentsApi {
  getClaimDocuments: (params: ApiParams<{partnerId: string, periodId: number, description: DocumentDescription}>) => Promise<DocumentSummaryDto[]>;
  getClaimDetailDocuments: (params: ApiParams<{claimDetailKey: ClaimDetailKey}>) => Promise<DocumentSummaryDto[]>;
  uploadClaimDetailDocument: (params: ApiParams<{claimDetailKey: ClaimDetailKey, file: FileUpload | File}>) => Promise<{ id: string }>;
  deleteDocument: (params: ApiParams<{ documentId: string }>) => Promise<void>;
}

class Controller extends ControllerBase<DocumentSummaryDto> implements IDocumentsApi {
  constructor() {
    super("documents");

    this.getItems(
      "/claim-details/:partnerId/:periodId/:costCategoryId",
      (p) => ({claimDetailKey: { partnerId: p.partnerId, periodId: parseInt(p.periodId, 10), costCategoryId: p.costCategoryId }}),
      p => this.getClaimDetailDocuments(p)
    );

    this.getItems(
      "/documents/claims/:partnerId/:periodId/",
      (p, q) => ({ partnerId: p.partnerId, periodId: parseInt(p.periodId, 10), description: q.description }),
      p => this.getClaimDocuments(p)
    );

    this.getAttachment(
      "/:documentId/content",
      (p) => ({ documentId: p.documentId }),
        p => this.getDocument(p)
    );

    this.postAttachment(
      "/claim-details/:partnerId/:periodId/:costCategoryId",
      (p, q, b, f) => ({ claimDetailKey: { partnerId: p.partnerId, periodId: parseInt(p.periodId, 10), costCategoryId: p.costCategoryId, file: f }, file: f }),
      p => this.uploadClaimDetailDocument(p)
    );

    this.deleteItem(
      "/:documentId",
      (p) => ({ documentId: p.documentId }),
      p => this.deleteDocument(p)
    );
  }

  public async getClaimDocuments(params: ApiParams<{partnerId: string, periodId: number}>) {
    const { partnerId, periodId } = params;
    const query = new GetClaimDocumentsQuery({partnerId, periodId}, {description: DocumentDescription.IAR});
    return await contextProvider.start(params).runQuery(query);
  }

  public async getClaimDetailDocuments(params: ApiParams<{claimDetailKey: ClaimDetailKey}>) {
    const { partnerId, periodId, costCategoryId } = params.claimDetailKey;
    const query = new GetClaimDetailDocumentsQuery(partnerId, periodId, costCategoryId);
    return await contextProvider.start(params).runQuery(query);
  }

  public async getDocument(params: ApiParams<{ documentId: string }>): Promise<DocumentDto> {
    const { documentId } = params;
    const query = new GetDocumentQuery(documentId);
    return await contextProvider.start(params).runQuery(query);
  }

  public async uploadClaimDetailDocument(params: ApiParams<{claimDetailKey: ClaimDetailKey, file: FileUpload | File}>) {
    const { claimDetailKey, file } = params;
    const query = new UploadClaimDetailDocumentCommand(claimDetailKey, file as FileUpload);
    const insertedID = await contextProvider.start(params).runQuery(query);
    return {id: insertedID};
  }

  public async deleteDocument(params: ApiParams<{ documentId: string }>): Promise<void> {
    const { documentId } = params;
    const command = new DeleteDocumentCommand(documentId);
    return contextProvider.start(params).runCommand(command);
  }
}

export const controller = new Controller();
