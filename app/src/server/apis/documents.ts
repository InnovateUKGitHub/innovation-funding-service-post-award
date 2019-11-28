import { DeleteProjectChangeRequestDocumentOrItemDocument } from "@server/features/documents/deleteProjectChangeRequestDocumentOrItemDocument";
import { ApiParams, ControllerBase } from "./controllerBase";
import contextProvider from "../features/common/contextProvider";
import { GetClaimDetailDocumentQuery } from "../features/documents/getClaimDetailDocument";
import { GetClaimDetailDocumentsQuery } from "../features/documents/getClaimDetailDocumentsSummary";
import { GetProjectChangeRequestDocumentOrItemDocumentsSummaryQuery } from "@server/features/documents/getProjectChangeRequestDocumentOrItemDocumentsSummary";
import { GetProjectChangeRequestDocumentOrItemDocumentQuery } from "@server/features/documents/getProjectChangeRequestDocumentOrItemDocument";
import { GetProjectDocumentsQuery } from "../features/documents/getProjectDocumentsSummary";
import { UploadClaimDetailDocumentCommand } from "../features/documents/uploadClaimDetailDocument";
import { GetClaimDocumentsQuery } from "../features/documents/getClaimDocumentsSummary";
import { GetClaimDocumentQuery } from "../features/documents/getClaimDocument";
import { DocumentDescription } from "@framework/constants";
import { UploadClaimDocumentCommand } from "../features/documents/uploadClaimDocument";
import { UploadProjectDocumentCommand } from "../features/documents/uploadProjectDocument";
import { DeleteClaimDetailDocumentCommand } from "@server/features/documents/deleteClaimDetailDocument";
import { DeleteClaimDocumentCommand } from "@server/features/documents/deleteClaimDocument";
import { GetProjectDocumentQuery } from "@server/features/documents/getProjectDocument";
import { UploadProjectChangeRequestDocumentOrItemDocumentCommand } from "@server/features/documents/uploadProjectChangeRequestDocumentOrItemDocument";

export interface IDocumentsApi {
  getClaimDocuments: (params: ApiParams<{ projectId: string, partnerId: string, periodId: number, description?: DocumentDescription }>) => Promise<DocumentSummaryDto[]>;
  getClaimDetailDocuments: (params: ApiParams<{ claimDetailKey: ClaimDetailKey }>) => Promise<DocumentSummaryDto[]>;
  getProjectChangeRequestDocumentsOrItemDocuments: (params: ApiParams<{ projectId: string, projectChangeRequestIdOrItemId: string }>) => Promise<DocumentSummaryDto[]>;
  getProjectDocuments: (params: ApiParams<{ projectId: string }>) => Promise<DocumentSummaryDto[]>;
  uploadClaimDetailDocuments: (params: ApiParams<{ claimDetailKey: ClaimDetailKey, documents: MultipleDocumentUploadDto }>) => Promise<{ documentIds: string[] }>;
  uploadClaimDocument: (params: ApiParams<{ claimKey: ClaimKey, document: DocumentUploadDto }>) => Promise<{ documentId: string }>;
  uploadProjectChangeRequestDocumentOrItemDocument: (params: ApiParams<{ projectId: string, projectChangeRequestIdOrItemId: string, documents: MultipleDocumentUploadDto }>) => Promise<{ documentIds: string[] }>;
  uploadProjectDocument: (params: ApiParams<{ projectId: string, documents: MultipleDocumentUploadDto }>) => Promise<{ documentIds: string[] }>;
  deleteClaimDetailDocument: (params: ApiParams<{ documentId: string, claimDetailKey: ClaimDetailKey }>) => Promise<boolean>;
  deleteClaimDocument: (params: ApiParams<{ documentId: string, claimKey: ClaimKey }>) => Promise<boolean>;
  deleteProjectChangeRequestDocumentOrItemDocument: (params: ApiParams<{documentId: string, projectId: string, projectChangeRequestIdOrItemId: string}>) => Promise<boolean>;
}

class Controller extends ControllerBase<DocumentSummaryDto> implements IDocumentsApi {
  constructor() {
    super("documents");

    this.getItems(
      "/claim-details/:projectId/:partnerId/:periodId/:costCategoryId",
      (p) => ({ claimDetailKey: { projectId: p.projectId, partnerId: p.partnerId, periodId: parseInt(p.periodId, 10), costCategoryId: p.costCategoryId } }),
      p => this.getClaimDetailDocuments(p)
    );

    this.getAttachment(
      "/claim-details/:projectId/:partnerId/:periodId/:costCategoryId/:documentId/content",
      (p) => ({ claimDetailKey: { projectId: p.projectId, partnerId: p.partnerId, periodId: parseInt(p.periodId, 10), costCategoryId: p.costCategoryId }, documentId: p.documentId }),
      p => this.getClaimDetailDocument(p)
    );

    this.deleteItem(
      "/claim-details/:projectId/:partnerId/:periodId/:costCategoryId/:documentId",
      (p) => ({ documentId: p.documentId, claimDetailKey: { projectId: p.projectId, partnerId: p.partnerId, periodId: parseInt(p.periodId, 10), costCategoryId: p.costCategoryId } }),
      p => this.deleteClaimDetailDocument(p)
    );

    this.getItems(
      "/claims/:projectId/:partnerId/:periodId/",
      (p, q) => ({ projectId: p.projectId, partnerId: p.partnerId, periodId: parseInt(p.periodId, 10), description: q.description }),
      p => this.getClaimDocuments(p)
    );

    this.getAttachment(
      "/claims/:projectId/:partnerId/:periodId/:documentId/content",
      (p, q) => ({ projectId: p.projectId, partnerId: p.partnerId, periodId: parseInt(p.periodId, 10), documentId: p.documentId }),
      p => this.getClaimDocument(p)
    );

    this.deleteItem(
      "/claims/:projectId/:partnerId/:periodId/:documentId",
      (p) => ({ documentId: p.documentId, claimKey: { projectId: p.projectId, partnerId: p.partnerId, periodId: parseInt(p.periodId, 10) } }),
      p => this.deleteClaimDocument(p)
    );

    this.getItems(
      "/projects/:projectId",
      (p) => ({ projectId: p.projectId }),
      p => this.getProjectDocuments(p)
    );

    this.getAttachment(
      "/projects/:projectId/:documentId/content",
      (p) => ({ projectId: p.projectId, documentId: p.documentId }),
      p => this.getProjectDocument(p)
    );

    this.getItems(
      "/projectChangeRequests/:projectId/:projectChangeRequestIdOrItemId",
      (p) => ({ projectId: p.projectId, projectChangeRequestIdOrItemId: p.projectChangeRequestIdOrItemId }),
      p => this.getProjectChangeRequestDocumentsOrItemDocuments(p)
    );

    this.getAttachment(
      "/projectChangeRequests/:projectId/:projectChangeRequestIdOrItemId/:documentId/content",
      (p) => ({ projectId: p.projectId, projectChangeRequestIdOrItemId: p.projectChangeRequestIdOrItemId, documentId: p.documentId }),
      p => this.getProjectChangeRequestDocumentOrItemDocument(p)
    );

    this.deleteItem(
      "/projectChangeRequests/:projectId/:projectChangeRequestIdOrItemId/:documentId",
      (p) => ({documentId: p.documentId, projectId: p.projectId, projectChangeRequestIdOrItemId: p.projectChangeRequestIdOrItemId}),
      p => this.deleteProjectChangeRequestDocumentOrItemDocument(p)
    );

    this.postAttachments(
      "/claim-details/:projectId/:partnerId/:periodId/:costCategoryId",
      (p, q, b) => ({ claimDetailKey: { projectId: p.projectId, partnerId: p.partnerId, periodId: parseInt(p.periodId, 10), costCategoryId: p.costCategoryId }}),
      p => this.uploadClaimDetailDocuments(p)
    );

    this.postAttachment(
      "/claims/:projectId/:partnerId/:periodId",
      (p, q, b) => ({ claimKey: { projectId: p.projectId, partnerId: p.partnerId, periodId: parseInt(p.periodId, 10) } }),
      p => this.uploadClaimDocument(p)
    );

    this.postAttachments(
      "/projects/:projectId",
      (p, q, b) => ({ projectId: p.projectId }),
      p => this.uploadProjectDocument(p)
    );

    this.postAttachments(
      "/projectChangeRequests/:projectId/:projectChangeRequestIdOrItemId",
      (p) => ({ projectId: p.projectId, projectChangeRequestIdOrItemId: p.projectChangeRequestIdOrItemId }),
      p => this.uploadProjectChangeRequestDocumentOrItemDocument(p)
    );
  }

  public async getClaimDocuments(params: ApiParams<{ projectId: string, partnerId: string, periodId: number, description?: string }>) {
    const { projectId, partnerId, periodId, description } = params;
    const query = new GetClaimDocumentsQuery({ projectId, partnerId, periodId }, description ? { description }: undefined);
    return contextProvider.start(params).runQuery(query);
  }

  public async getClaimDocument(params: ApiParams<{ projectId: string, partnerId: string, periodId: number, documentId: string }>) {
    const { projectId, partnerId, periodId, documentId } = params;
    const query = new GetClaimDocumentQuery({ projectId, partnerId, periodId }, documentId);
    return contextProvider.start(params).runQuery(query);
  }

  public async getClaimDetailDocuments(params: ApiParams<{ claimDetailKey: ClaimDetailKey }>) {
    const { projectId, partnerId, periodId, costCategoryId } = params.claimDetailKey;
    const query = new GetClaimDetailDocumentsQuery(projectId, partnerId, periodId, costCategoryId);
    return contextProvider.start(params).runQuery(query);
  }

  public async getClaimDetailDocument(params: ApiParams<{ claimDetailKey: ClaimDetailKey, documentId: string }>) {
    const query = new GetClaimDetailDocumentQuery(params.claimDetailKey, params.documentId);
    return contextProvider.start(params).runQuery(query);
  }

  public async getProjectDocuments(params: ApiParams<{ projectId: string }>) {
    const { projectId } = params;
    const query = new GetProjectDocumentsQuery(projectId);
    return contextProvider.start(params).runQuery(query);
  }

  public async getProjectDocument(params: ApiParams<{ projectId: string, documentId: string }>) {
    const query = new GetProjectDocumentQuery(params.projectId, params.documentId);
    return contextProvider.start(params).runQuery(query);
  }

  public async getProjectChangeRequestDocumentsOrItemDocuments(params: ApiParams<{ projectId: string, projectChangeRequestIdOrItemId: string }>) {
    const query = new GetProjectChangeRequestDocumentOrItemDocumentsSummaryQuery(params.projectId, params.projectChangeRequestIdOrItemId);
    return contextProvider.start(params).runQuery(query);
  }

  public async getProjectChangeRequestDocumentOrItemDocument(params: ApiParams<{ projectId: string, projectChangeRequestIdOrItemId: string, documentId: string }>) {
    const query = new GetProjectChangeRequestDocumentOrItemDocumentQuery(params.projectId, params.projectChangeRequestIdOrItemId, params.documentId);
    return contextProvider.start(params).runQuery(query);
  }

  public async deleteProjectChangeRequestDocumentOrItemDocument(params: ApiParams<{ projectId: string, projectChangeRequestIdOrItemId: string, documentId: string }>) {
    const command = new DeleteProjectChangeRequestDocumentOrItemDocument(params.documentId, params.projectId, params.projectChangeRequestIdOrItemId);
    await contextProvider.start(params).runCommand(command);
    return true;
  }

  public async uploadClaimDetailDocuments(params: ApiParams<{ claimDetailKey: ClaimDetailKey, documents: MultipleDocumentUploadDto }>) {
    const { claimDetailKey, documents } = params;
    const command = new UploadClaimDetailDocumentCommand(claimDetailKey, documents);
    const insertedIDs = await contextProvider.start(params).runCommand(command);
    return { documentIds: insertedIDs };
  }

  public async uploadClaimDocument(params: ApiParams<{ claimKey: ClaimKey, document: DocumentUploadDto }>) {
    const { claimKey, document } = params;
    const command = new UploadClaimDocumentCommand(claimKey, document);
    const insertedID = await contextProvider.start(params).runCommand(command);
    return { documentId: insertedID };
  }

  public async uploadProjectChangeRequestDocumentOrItemDocument(params: ApiParams<{ projectId: string, projectChangeRequestIdOrItemId: string, documents: MultipleDocumentUploadDto }>) {
    const command = new UploadProjectChangeRequestDocumentOrItemDocumentCommand(params.projectId, params.projectChangeRequestIdOrItemId, params.documents);
    const insertedIds = await contextProvider.start(params).runCommand(command);

    return {documentIds: insertedIds};
  }

  public async uploadProjectDocument(params: ApiParams<{ projectId: string, documents: MultipleDocumentUploadDto }>) {
    const command = new UploadProjectDocumentCommand(params.projectId, params.documents);
    const insertedIDs = await contextProvider.start(params).runCommand(command);

    return { documentIds: insertedIDs };
  }

  public async deleteClaimDetailDocument(params: ApiParams<{ documentId: string, claimDetailKey: ClaimDetailKey }>): Promise<boolean> {
    const { documentId, claimDetailKey } = params;
    const command = new DeleteClaimDetailDocumentCommand(documentId, claimDetailKey);
    await contextProvider.start(params).runCommand(command);
    return true;
  }

  public async deleteClaimDocument(params: ApiParams<{ documentId: string, claimKey: ClaimKey }>): Promise<boolean> {
    const { documentId, claimKey } = params;
    const command = new DeleteClaimDocumentCommand(documentId, claimKey);
    await contextProvider.start(params).runCommand(command);

    return true;
  }
}

export const controller = new Controller();
