import { ApiParams, ControllerBase } from "./controllerBase";
import contextProvider from "../features/common/contextProvider";
import { GetClaimDetailDocumentsQuery } from "../features/documents/getClaimDetailDocuments";
import { GetDocumentQuery } from "../features/documents/getDocument";
import { GetProjectDocumentsQuery } from "../features/documents/getProjectDocuments";
import { UploadClaimDetailDocumentCommand } from "../features/documents/uploadClaimDetailDocument";
import { DeleteDocumentCommand } from "../features/documents/deleteDocument";
import { FileUpload } from "../../types/FileUpload";
import {GetClaimDocumentsQuery} from "../features/documents/getClaimDocuments";
import {DocumentDescription} from "../../types/constants";
import { UploadClaimDocumentCommand } from "../features/documents/uploadClaimDocument";
import { UploadProjectDocumentCommand } from "../features/documents/uploadProjectDocument";

export interface IDocumentsApi {
  getClaimDocuments: (params: ApiParams<{partnerId: string, periodId: number, description: DocumentDescription}>) => Promise<DocumentSummaryDto[]>;
  getClaimDetailDocuments: (params: ApiParams<{claimDetailKey: ClaimDetailKey}>) => Promise<DocumentSummaryDto[]>;
  getProjectDocuments: (params: ApiParams<{projectId: string}>) => Promise<DocumentSummaryDto[]>;
  uploadClaimDetailDocument: (params: ApiParams<{claimDetailKey: ClaimDetailKey, file: FileUpload | File}>) => Promise<{ documentId: string }>;
  uploadClaimDocument: (params: ApiParams<{claimKey: ClaimKey, file: FileUpload | File, description?: string}>) => Promise<{ documentId: string }>;
  uploadProjectDocument: (params: ApiParams<{projectId: string, file: FileUpload | File, description?: string}>) => Promise<{ documentId: string }>;
  deleteDocument: (params: ApiParams<{ documentId: string }>) => Promise<boolean>;
}

class Controller extends ControllerBase<DocumentSummaryDto> implements IDocumentsApi {
  constructor() {
    super("documents");

    this.getItems(
      "/claim-details/:projectId/:partnerId/:periodId/:costCategoryId",
      (p) => ({claimDetailKey: { projectId: p.projectId, partnerId: p.partnerId, periodId: parseInt(p.periodId, 10), costCategoryId: p.costCategoryId }}),
      p => this.getClaimDetailDocuments(p)
    );

    this.getItems(
      "/claims/:partnerId/:periodId/",
      (p, q) => ({ partnerId: p.partnerId, periodId: parseInt(p.periodId, 10), description: q.description }),
      p => this.getClaimDocuments(p)
    );

    this.getItems(
      "/projects/:projectId",
      (p) => ({projectId: p.projectId}),
      p => this.getProjectDocuments(p)
    );

    this.getAttachment(
      "/:documentId/content",
      (p) => ({ documentId: p.documentId }),
        p => this.getDocument(p)
    );

    this.postAttachment(
      "/claim-details/:projectId/:partnerId/:periodId/:costCategoryId",
      (p, q, b, f) => ({ claimDetailKey: { projectId: p.projectId, partnerId: p.partnerId, periodId: parseInt(p.periodId, 10), costCategoryId: p.costCategoryId, file: f }, file: f }),
      p => this.uploadClaimDetailDocument(p)
    );

    this.postAttachment(
      "/claims/:partnerId/:periodId",
      (p, q, b, f) => ({ claimKey: { partnerId: p.partnerId, periodId: parseInt(p.periodId, 10), file: f }, file: { ...f, ...b }}),
      p => this.uploadClaimDocument(p)
    );

    this.postAttachment(
      "/projects/:projectId",
      (p, q, b, f) => ({ projectId: p.projectId, file: f }),
      p => this.uploadProjectDocument(p)
    );

    this.deleteItem(
      "/:documentId",
      (p) => ({ documentId: p.documentId }),
      p => this.deleteDocument(p)
    );
  }

  public async getClaimDocuments(params: ApiParams<{partnerId: string, periodId: number, description: string}>) {
    const { partnerId, periodId, description } = params;
    const query = new GetClaimDocumentsQuery({partnerId, periodId}, {description});
    return contextProvider.start(params).runQuery(query);
  }

  public async getClaimDetailDocuments(params: ApiParams<{claimDetailKey: ClaimDetailKey}>) {
    const { projectId, partnerId, periodId, costCategoryId } = params.claimDetailKey;
    const query = new GetClaimDetailDocumentsQuery(projectId, partnerId, periodId, costCategoryId);
    return contextProvider.start(params).runQuery(query);
  }

  public async getProjectDocuments(params: ApiParams<{ projectId: string }>) {
    const { projectId } = params;
    const query = new GetProjectDocumentsQuery(projectId);
    return contextProvider.start(params).runQuery(query);
  }

  public async getDocument(params: ApiParams<{ documentId: string }>): Promise<DocumentDto> {
    const { documentId } = params;
    const query = new GetDocumentQuery(documentId);
    return contextProvider.start(params).runQuery(query);
  }

  public async uploadClaimDetailDocument(params: ApiParams<{claimDetailKey: ClaimDetailKey, file: FileUpload | File}>) {
    const { claimDetailKey, file } = params;
    const command = new UploadClaimDetailDocumentCommand(claimDetailKey, file as FileUpload);
    const insertedID = await contextProvider.start(params).runCommand(command);
    return {documentId: insertedID};
  }

  public async uploadClaimDocument(params: ApiParams<{claimKey: ClaimKey, file: FileUpload | File}>) {
    const { claimKey, file } = params;
    const command = new UploadClaimDocumentCommand(claimKey, file as FileUpload);
    const insertedID = await contextProvider.start(params).runCommand(command);
    return {documentId: insertedID};
  }

  public async uploadProjectDocument(params: ApiParams<{projectId: string, file: FileUpload | File}>) {
    const command = new UploadProjectDocumentCommand(params.projectId, params.file as FileUpload);
    const insertedID = await contextProvider.start(params).runCommand(command);

    return { documentId: insertedID };
  }

  public async deleteDocument(params: ApiParams<{ documentId: string }>): Promise<boolean> {
    const { documentId } = params;
    const command = new DeleteDocumentCommand(documentId);
    await contextProvider.start(params).runCommand(command);
    return true;
  }
}

export const controller = new Controller();
