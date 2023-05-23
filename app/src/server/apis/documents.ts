import { contextProvider } from "@server/features/common/contextProvider";
import { ApiParams, ControllerBase } from "@server/apis/controllerBase";

import { DeleteProjectChangeRequestDocumentOrItemDocument } from "@server/features/documents/deleteProjectChangeRequestDocumentOrItemDocument";
import { GetProjectChangeRequestDocumentOrItemDocumentsSummaryQuery } from "@server/features/documents/getProjectChangeRequestDocumentOrItemDocumentsSummary";
import { GetProjectChangeRequestDocumentOrItemDocumentQuery } from "@server/features/documents/getProjectChangeRequestDocumentOrItemDocument";
import { DocumentDescription } from "@framework/constants";
import { DeleteClaimDetailDocumentCommand } from "@server/features/documents/deleteClaimDetailDocument";
import { DeleteClaimDocumentCommand } from "@server/features/documents/deleteClaimDocument";
import { GetProjectDocumentQuery } from "@server/features/documents/getProjectDocument";
import { UploadProjectChangeRequestDocumentOrItemDocumentCommand } from "@server/features/documents/uploadProjectChangeRequestDocumentOrItemDocument";
import { UploadClaimDocumentsCommand } from "@server/features/documents/uploadClaimDocuments";
import { DocumentUploadDto, MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { AllPartnerDocumentSummaryDto, DocumentDto, DocumentSummaryDto } from "@framework/dtos/documentDto";
import { GetPartnerDocumentQuery } from "@server/features/documents/getPartnerDocument";
import { GetPartnerDocumentsQuery } from "@server/features/documents/getPartnerDocumentsSummaryQuery";
import { UploadPartnerDocumentCommand } from "@server/features/documents/uploadPartnerDocument";
import { DeletePartnerDocumentCommand } from "@server/features/documents/deletePartnerDocument";

import { GetLoanDocumentsQuery } from "@server/features/documents/getLoanDocuments";
import { UploadLoanDocumentsCommand } from "@server/features/documents/uploadLoanDocument";
import { GetLoanDocumentQuery } from "@server/features/documents/getLoanDocument";
import { DeleteLoanDocument } from "@server/features/documents/deleteLoanDocument";

import { ClaimDetailKey, ClaimKey } from "@framework/types";
import { DeleteProjectDocumentCommand } from "@server/features/documents/deleteProjectDocument";
import { UploadProjectDocumentCommand } from "../features/documents/uploadProjectDocument";
import { UploadClaimDocumentCommand } from "../features/documents/uploadClaimDocument";
import { GetClaimDocumentQuery } from "../features/documents/getClaimDocument";
import { GetClaimDocumentsQuery } from "../features/documents/getClaimDocumentsSummary";
import { UploadClaimDetailDocumentCommand } from "../features/documents/uploadClaimDetailDocument";
import { GetProjectDocumentSummaryQuery } from "../features/documents/getProjectDocumentSummaryQuery";
import { GetClaimDetailDocumentsQuery } from "../features/documents/getClaimDetailDocumentsSummary";
import { GetClaimDetailDocumentQuery } from "../features/documents/getClaimDetailDocument";
import { GetAllPartnerDocumentsQuery } from "@server/features/documents/getAllPartnerDocumentsSummaryQuery";

export interface IDocumentsApi {
  getClaimDocuments: (
    params: ApiParams<{
      projectId: ProjectId;
      partnerId: PartnerId;
      periodId: number;
      description?: DocumentDescription;
    }>,
  ) => Promise<DocumentSummaryDto[]>;
  getClaimDetailDocuments: (params: ApiParams<{ claimDetailKey: ClaimDetailKey }>) => Promise<DocumentSummaryDto[]>;
  getProjectChangeRequestDocumentsOrItemDocuments: (
    params: ApiParams<{ projectId: ProjectId; projectChangeRequestIdOrItemId: string }>,
  ) => Promise<DocumentSummaryDto[]>;
  getProjectDocuments: (params: ApiParams<{ projectId: ProjectId }>) => Promise<DocumentSummaryDto[]>;
  getPartnerDocuments: (
    params: ApiParams<{ projectId: ProjectId; partnerId: PartnerId }>,
  ) => Promise<DocumentSummaryDto[]>;
  getAllPartnerDocuments: (params: ApiParams<{ projectId: ProjectId }>) => Promise<AllPartnerDocumentSummaryDto>;
  getLoanDocuments: (params: ApiParams<{ projectId: ProjectId; loanId: string }>) => Promise<DocumentSummaryDto[]>;
  uploadClaimDetailDocuments: (
    params: ApiParams<{ claimDetailKey: ClaimDetailKey; documents: MultipleDocumentUploadDto }>,
  ) => Promise<{ documentIds: string[] }>;
  uploadClaimDocument: (
    params: ApiParams<{ claimKey: ClaimKey; document: DocumentUploadDto }>,
  ) => Promise<{ documentId: string }>;
  uploadClaimDocuments: (
    params: ApiParams<{ claimKey: ClaimKey; documents: MultipleDocumentUploadDto }>,
  ) => Promise<{ documentIds: string[] }>;
  uploadProjectChangeRequestDocumentOrItemDocument: (
    params: ApiParams<{
      projectId: ProjectId;
      projectChangeRequestIdOrItemId: string;
      documents: MultipleDocumentUploadDto;
    }>,
  ) => Promise<{ documentIds: string[] }>;
  uploadProjectDocument: (
    params: ApiParams<{ projectId: ProjectId; documents: MultipleDocumentUploadDto }>,
  ) => Promise<{ documentIds: string[] }>;
  uploadPartnerDocument: (
    params: ApiParams<{ projectId: ProjectId; partnerId: PartnerId; documents: MultipleDocumentUploadDto }>,
  ) => Promise<{ documentIds: string[] }>;
  uploadLoanDocuments: (
    params: ApiParams<{ projectId: ProjectId; loanId: LoanId; documents: MultipleDocumentUploadDto }>,
  ) => Promise<{ documentIds: string[] }>;
  deleteLoanDocument: (
    params: ApiParams<{ projectId: ProjectId; loanId: LoanId; documentId: string }>,
  ) => Promise<boolean>;
  deleteClaimDetailDocument: (
    params: ApiParams<{ documentId: string; claimDetailKey: ClaimDetailKey }>,
  ) => Promise<boolean>;
  deleteClaimDocument: (params: ApiParams<{ documentId: string; claimKey: ClaimKey }>) => Promise<boolean>;
  deletePartnerDocument: (
    params: ApiParams<{ documentId: string; projectId: ProjectId; partnerId: PartnerId }>,
  ) => Promise<boolean>;
  deleteProjectDocument: (params: ApiParams<{ projectId: ProjectId; documentId: string }>) => Promise<boolean>;
  deleteProjectChangeRequestDocumentOrItemDocument: (
    params: ApiParams<{ documentId: string; projectId: ProjectId; projectChangeRequestIdOrItemId: string }>,
  ) => Promise<boolean>;
}

class Controller extends ControllerBase<DocumentSummaryDto> implements IDocumentsApi {
  constructor() {
    super("documents");

    this.getItems(
      "/claim-details/:projectId/:partnerId/:periodId/:costCategoryId",
      p => ({
        claimDetailKey: {
          projectId: p.projectId,
          partnerId: p.partnerId,
          periodId: parseInt(p.periodId, 10),
          costCategoryId: p.costCategoryId,
        },
      }),
      p => this.getClaimDetailDocuments(p),
    );

    this.getAttachment(
      "/claim-details/:projectId/:partnerId/:periodId/:costCategoryId/:documentId/content",
      p => ({
        claimDetailKey: {
          projectId: p.projectId,
          partnerId: p.partnerId,
          periodId: parseInt(p.periodId, 10),
          costCategoryId: p.costCategoryId,
        },
        documentId: p.documentId,
      }),
      p => this.getClaimDetailDocument(p),
    );

    this.deleteItem(
      "/claim-details/:projectId/:partnerId/:periodId/:costCategoryId/:documentId",
      p => ({
        documentId: p.documentId,
        claimDetailKey: {
          projectId: p.projectId,
          partnerId: p.partnerId,
          periodId: parseInt(p.periodId, 10),
          costCategoryId: p.costCategoryId,
        },
      }),
      p => this.deleteClaimDetailDocument(p),
    );

    this.getItems(
      "/claims/:projectId/:partnerId/:periodId/",
      (p, q) => ({
        projectId: p.projectId,
        partnerId: p.partnerId,
        periodId: parseInt(p.periodId, 10),
        description: parseInt(q.description, 10),
      }),
      p => this.getClaimDocuments(p),
    );

    this.getAttachment(
      "/claims/:projectId/:partnerId/:periodId/:documentId/content",
      p => ({
        projectId: p.projectId,
        partnerId: p.partnerId,
        periodId: parseInt(p.periodId, 10),
        documentId: p.documentId,
      }),
      p => this.getClaimDocument(p),
    );

    this.deleteItem(
      "/claims/:projectId/:partnerId/:periodId/:documentId",
      p => ({
        documentId: p.documentId,
        claimKey: { projectId: p.projectId, partnerId: p.partnerId, periodId: parseInt(p.periodId, 10) },
      }),
      p => this.deleteClaimDocument(p),
    );

    this.deleteItem(
      "/partners/:projectId/:partnerId/:documentId",
      p => ({ documentId: p.documentId, projectId: p.projectId, partnerId: p.partnerId }),
      p => this.deletePartnerDocument(p),
    );

    this.deleteItem(
      "/projects/:projectId/:documentId",
      p => ({ projectId: p.projectId, documentId: p.documentId }),
      p => this.deleteProjectDocument(p),
    );

    this.getItems("/projects/:projectId", p => ({ projectId: p.projectId }), this.getProjectDocuments);
    this.getItems("/partners/:projectId", p => ({ projectId: p.projectId }), this.getAllPartnerDocuments);

    this.getAttachment(
      "/loans/:projectId/:loanId/:documentId/content",
      p => ({ projectId: p.projectId, loanId: p.loanId, documentId: p.documentId }),
      this.getLoanDocument,
    );

    this.getItems(
      "/loans/:projectId/:loanId",
      p => ({ projectId: p.projectId, loanId: p.loanId }),
      this.getLoanDocuments,
    );

    this.postAttachments(
      "/loans/:projectId/:loanId",
      p => ({ projectId: p.projectId, loanId: p.loanId }),
      this.uploadLoanDocuments,
    );

    this.deleteItem(
      "/loans/:projectId/:loanId/:documentId",
      p => ({ projectId: p.projectId, loanId: p.loanId, documentId: p.documentId }),
      this.deleteLoanDocument,
    );

    this.getItems(
      "/partners/:projectId/:partnerId",
      p => ({ projectId: p.projectId, partnerId: p.partnerId }),
      p => this.getPartnerDocuments(p),
    );

    this.getAttachment(
      "/projects/:projectId/:documentId/content",
      p => ({ projectId: p.projectId, documentId: p.documentId }),
      p => this.getProjectDocument(p),
    );

    this.getAttachment(
      "/partners/:projectId/:partnerId/:documentId/content",
      p => ({ projectId: p.projectId, partnerId: p.partnerId, documentId: p.documentId }),
      p => this.getPartnerDocument(p),
    );

    this.getItems(
      "/projectChangeRequests/:projectId/:projectChangeRequestIdOrItemId",
      p => ({ projectId: p.projectId, projectChangeRequestIdOrItemId: p.projectChangeRequestIdOrItemId }),
      p => this.getProjectChangeRequestDocumentsOrItemDocuments(p),
    );

    this.getAttachment(
      "/projectChangeRequests/:projectId/:projectChangeRequestIdOrItemId/:documentId/content",
      p => ({
        projectId: p.projectId,
        projectChangeRequestIdOrItemId: p.projectChangeRequestIdOrItemId,
        documentId: p.documentId,
      }),
      p => this.getProjectChangeRequestDocumentOrItemDocument(p),
    );

    this.deleteItem(
      "/projectChangeRequests/:projectId/:projectChangeRequestIdOrItemId/:documentId",
      p => ({
        documentId: p.documentId,
        projectId: p.projectId,
        projectChangeRequestIdOrItemId: p.projectChangeRequestIdOrItemId,
      }),
      p => this.deleteProjectChangeRequestDocumentOrItemDocument(p),
    );

    this.postAttachments(
      "/claim-details/:projectId/:partnerId/:periodId/:costCategoryId",
      p => ({
        claimDetailKey: {
          projectId: p.projectId,
          partnerId: p.partnerId,
          periodId: parseInt(p.periodId, 10),
          costCategoryId: p.costCategoryId,
        },
      }),
      p => this.uploadClaimDetailDocuments(p),
    );

    this.postAttachment(
      "/claims/:projectId/:partnerId/:periodId",
      p => ({ claimKey: { projectId: p.projectId, partnerId: p.partnerId, periodId: parseInt(p.periodId, 10) } }),
      p => this.uploadClaimDocument(p),
    );

    this.postAttachments(
      "/claimDocuments/:projectId/:partnerId/:periodId",
      p => ({ claimKey: { projectId: p.projectId, partnerId: p.partnerId, periodId: parseInt(p.periodId, 10) } }),
      p => this.uploadClaimDocuments(p),
    );

    this.postAttachments(
      "/projects/:projectId",
      p => ({ projectId: p.projectId }),
      p => this.uploadProjectDocument(p),
    );

    this.postAttachments(
      "/partners/:projectId/:partnerId",
      p => ({ projectId: p.projectId, partnerId: p.partnerId }),
      p => this.uploadPartnerDocument(p),
    );

    this.postAttachments(
      "/projectChangeRequests/:projectId/:projectChangeRequestIdOrItemId",
      p => ({ projectId: p.projectId, projectChangeRequestIdOrItemId: p.projectChangeRequestIdOrItemId }),
      p => this.uploadProjectChangeRequestDocumentOrItemDocument(p),
    );
  }

  public async getLoanDocument(
    params: ApiParams<{ projectId: ProjectId; loanId: LoanId; documentId: string }>,
  ): Promise<DocumentDto | null> {
    const query = new GetLoanDocumentQuery(params.projectId, params.loanId, params.documentId);
    return contextProvider.start(params).runQuery(query);
  }

  public async getLoanDocuments(params: ApiParams<{ projectId: ProjectId; loanId: string }>) {
    const query = new GetLoanDocumentsQuery(params.projectId, params.loanId);
    return contextProvider.start(params).runQuery(query);
  }

  public async uploadLoanDocuments(
    params: ApiParams<{ projectId: ProjectId; loanId: LoanId; documents: MultipleDocumentUploadDto }>,
  ) {
    const command = new UploadLoanDocumentsCommand(params.documents, params.projectId, params.loanId);
    const insertedIDs = await contextProvider.start(params).runCommand(command);

    return { documentIds: insertedIDs };
  }

  public async deleteLoanDocument(params: ApiParams<{ projectId: ProjectId; loanId: LoanId; documentId: string }>) {
    const command = new DeleteLoanDocument(params.documentId, params.projectId, params.loanId);
    await contextProvider.start(params).runCommand(command);
    return true;
  }

  public async getClaimDocuments(
    params: ApiParams<{
      projectId: ProjectId;
      partnerId: PartnerId;
      periodId: number;
      description?: DocumentDescription;
    }>,
  ) {
    const { projectId, partnerId, periodId, description } = params;
    const query = new GetClaimDocumentsQuery(
      { projectId, partnerId, periodId },
      description ? { description } : undefined,
    );
    return contextProvider.start(params).runQuery(query);
  }

  public async getClaimDocument(
    params: ApiParams<{ projectId: ProjectId; partnerId: PartnerId; periodId: number; documentId: string }>,
  ) {
    const { projectId, partnerId, periodId, documentId } = params;
    const query = new GetClaimDocumentQuery({ projectId, partnerId, periodId }, documentId);
    return contextProvider.start(params).runQuery(query);
  }

  public async getClaimDetailDocuments(params: ApiParams<{ claimDetailKey: ClaimDetailKey }>) {
    const { projectId, partnerId, periodId, costCategoryId } = params.claimDetailKey;
    const query = new GetClaimDetailDocumentsQuery(projectId, partnerId, periodId, costCategoryId);
    return contextProvider.start(params).runQuery(query);
  }

  public async getClaimDetailDocument(params: ApiParams<{ claimDetailKey: ClaimDetailKey; documentId: string }>) {
    const query = new GetClaimDetailDocumentQuery(params.claimDetailKey, params.documentId);
    return contextProvider.start(params).runQuery(query);
  }

  public async getProjectDocuments(params: ApiParams<{ projectId: ProjectId }>) {
    const { projectId } = params;
    const query = new GetProjectDocumentSummaryQuery(projectId);
    return contextProvider.start(params).runQuery(query);
  }

  public async getPartnerDocuments(params: ApiParams<{ projectId: ProjectId; partnerId: PartnerId }>) {
    const { projectId, partnerId } = params;
    const query = new GetPartnerDocumentsQuery(projectId, partnerId);
    return contextProvider.start(params).runQuery(query);
  }

  public async getAllPartnerDocuments(params: ApiParams<{ projectId: ProjectId }>) {
    const { projectId } = params;
    const query = new GetAllPartnerDocumentsQuery(projectId);
    return contextProvider.start(params).runQuery(query);
  }

  public async getProjectDocument(params: ApiParams<{ projectId: ProjectId; documentId: string }>) {
    const query = new GetProjectDocumentQuery(params.projectId, params.documentId);
    return contextProvider.start(params).runQuery(query);
  }

  public async getPartnerDocument(
    params: ApiParams<{ projectId: ProjectId; partnerId: PartnerId; documentId: string }>,
  ) {
    const query = new GetPartnerDocumentQuery(params.projectId, params.partnerId, params.documentId);
    return contextProvider.start(params).runQuery(query);
  }

  public async getProjectChangeRequestDocumentsOrItemDocuments(
    params: ApiParams<{ projectId: ProjectId; projectChangeRequestIdOrItemId: string }>,
  ) {
    const query = new GetProjectChangeRequestDocumentOrItemDocumentsSummaryQuery(
      params.projectId,
      params.projectChangeRequestIdOrItemId,
    );
    return contextProvider.start(params).runQuery(query);
  }

  public async getProjectChangeRequestDocumentOrItemDocument(
    params: ApiParams<{ projectId: ProjectId; projectChangeRequestIdOrItemId: string; documentId: string }>,
  ) {
    const query = new GetProjectChangeRequestDocumentOrItemDocumentQuery(
      params.projectId,
      params.projectChangeRequestIdOrItemId,
      params.documentId,
    );
    return contextProvider.start(params).runQuery(query);
  }

  public async deleteProjectChangeRequestDocumentOrItemDocument(
    params: ApiParams<{ projectId: ProjectId; projectChangeRequestIdOrItemId: string; documentId: string }>,
  ) {
    const command = new DeleteProjectChangeRequestDocumentOrItemDocument(
      params.documentId,
      params.projectId,
      params.projectChangeRequestIdOrItemId,
    );
    await contextProvider.start(params).runCommand(command);
    return true;
  }

  public async uploadClaimDetailDocuments(
    params: ApiParams<{ claimDetailKey: ClaimDetailKey; documents: MultipleDocumentUploadDto }>,
  ) {
    const { claimDetailKey, documents } = params;
    const command = new UploadClaimDetailDocumentCommand(claimDetailKey, documents);
    const insertedIDs = await contextProvider.start(params).runCommand(command);
    return { documentIds: insertedIDs };
  }

  public async uploadClaimDocument(params: ApiParams<{ claimKey: ClaimKey; document: DocumentUploadDto }>) {
    const { claimKey, document } = params;
    const command = new UploadClaimDocumentCommand(claimKey, document);
    const insertedID = await contextProvider.start(params).runCommand(command);
    return { documentId: insertedID };
  }

  public async uploadClaimDocuments(params: ApiParams<{ claimKey: ClaimKey; documents: MultipleDocumentUploadDto }>) {
    const { claimKey, documents } = params;
    const command = new UploadClaimDocumentsCommand(claimKey, documents);
    const insertedIDs = await contextProvider.start(params).runCommand(command);
    return { documentIds: insertedIDs };
  }

  public async uploadProjectChangeRequestDocumentOrItemDocument(
    params: ApiParams<{
      projectId: ProjectId;
      projectChangeRequestIdOrItemId: string;
      documents: MultipleDocumentUploadDto;
    }>,
  ) {
    const command = new UploadProjectChangeRequestDocumentOrItemDocumentCommand(
      params.projectId,
      params.projectChangeRequestIdOrItemId,
      params.documents,
    );
    const insertedIds = await contextProvider.start(params).runCommand(command);

    return { documentIds: insertedIds };
  }

  public async uploadProjectDocument(
    params: ApiParams<{ projectId: ProjectId; documents: MultipleDocumentUploadDto }>,
  ) {
    const command = new UploadProjectDocumentCommand(params.projectId, params.documents);
    const insertedIDs = await contextProvider.start(params).runCommand(command);

    return { documentIds: insertedIDs };
  }

  public async uploadPartnerDocument(
    params: ApiParams<{ projectId: ProjectId; partnerId: PartnerId; documents: MultipleDocumentUploadDto }>,
  ) {
    const command = new UploadPartnerDocumentCommand(params.projectId, params.partnerId, params.documents);
    const insertedIDs = await contextProvider.start(params).runCommand(command);

    return { documentIds: insertedIDs };
  }

  public async deleteClaimDetailDocument(
    params: ApiParams<{ documentId: string; claimDetailKey: ClaimDetailKey }>,
  ): Promise<boolean> {
    const { documentId, claimDetailKey } = params;
    const command = new DeleteClaimDetailDocumentCommand(documentId, claimDetailKey);
    await contextProvider.start(params).runCommand(command);
    return true;
  }

  public async deleteClaimDocument(params: ApiParams<{ documentId: string; claimKey: ClaimKey }>): Promise<boolean> {
    const { documentId, claimKey } = params;
    const command = new DeleteClaimDocumentCommand(documentId, claimKey);
    await contextProvider.start(params).runCommand(command);

    return true;
  }

  public async deletePartnerDocument(
    params: ApiParams<{ projectId: ProjectId; partnerId: PartnerId | LinkedEntityId; documentId: string }>,
  ): Promise<boolean> {
    const { documentId, projectId, partnerId } = params;
    const command = new DeletePartnerDocumentCommand(projectId, partnerId, documentId);
    await contextProvider.start(params).runCommand(command);

    return true;
  }

  public async deleteProjectDocument(
    params: ApiParams<{ projectId: ProjectId; documentId: string }>,
  ): Promise<boolean> {
    const { projectId, documentId } = params;
    const command = new DeleteProjectDocumentCommand(projectId, documentId);
    await contextProvider.start(params).runCommand(command);

    return true;
  }
}

export const controller = new Controller();
