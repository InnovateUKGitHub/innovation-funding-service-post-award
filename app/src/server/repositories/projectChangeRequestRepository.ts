import {
  PCR,
  PCRItem,
  PCRItemStatus,
  PCRStatus,
  ProjectChangeRequestForCreate,
  ProjectChangeRequestItemForCreate
} from "@framework/entities/pcr";
import SalesforceRepositoryBase from "./salesforceRepositoryBase";
import { Connection } from "jsforce";
import { ILogger } from "@server/features/common/logger";
import { SalesforcePCRMapper } from "./mappers/pcrSummaryMapper";
import { NotFoundError } from "@server/features/common";

export interface IProjectChangeRequestRepository {
  createProjectChangeRequest(projectChangeRequest: ProjectChangeRequestForCreate): Promise<string>;
  updateProjectChangeRequest(pcr: PCR): Promise<void>;
  updateItems(pcr: PCR, items: PCRItem[]): Promise<void>;
  getAllByProjectId(projectId: string): Promise<PCR[]>;
  getById(projectId: string, id: string): Promise<PCR>;
  insertItems(headerId: string, items: ProjectChangeRequestItemForCreate[]): Promise<void>;
  isExisting(projectId: string, projectChangeRequestId: string): Promise<boolean>;
  delete(pcr: PCR): Promise<void>;
}

export interface ISalesforcePCR {
  Id: string;
  Acc_RequestHeader__c: string;
  Acc_RequestNumber__c: number;
  Acc_Status__c: string;
  StatusName: string;
  CreatedDate: string;
  LastModifiedDate: string;
  RecordTypeId: string;
  Acc_Project_Participant__c: string;
  Acc_Project_Participant__r: {
    Id: string;
    Acc_ProjectId__c: string;
  };
  Acc_Reasoning__c: string;
  // careful there is a typo in the salesforce setup
  // will probably change to Acc_MarkedAsComplete__c in the future!!
  Acc_MarkedasComplete__c: string;
  MarkedAsCompleteName: string;
  Acc_Comments__c: string;
}

export class ProjectChangeRequestRepository extends SalesforceRepositoryBase<ISalesforcePCR> implements IProjectChangeRequestRepository {
  constructor(private getRecordTypeId: (objectName: string, recordType: string) => Promise<string>, getSalesforceConnection: () => Promise<Connection>, logger: ILogger) {
    super(getSalesforceConnection, logger);
  }

  protected salesforceObjectName = "Acc_ProjectChangeRequest__c";
  private recordType = "Request Header";

  protected salesforceFieldNames: string[] = [
    "Id",
    "Acc_RequestHeader__c",
    "Acc_RequestNumber__c",
    "Acc_Status__c",
    "toLabel(Acc_Status__c) StatusName",
    "CreatedDate",
    "LastModifiedDate",
    "RecordTypeId",
    "Acc_Project_Participant__r.Id",
    "Acc_Project_Participant__r.Acc_ProjectId__c",
    "Acc_Reasoning__c",
    "Acc_MarkedAsComplete__c",
    "toLabel(Acc_MarkedAsComplete__c) MarkedAsCompleteName",
    "Acc_Comments__c",
  ];

  async getAllByProjectId(projectId: string): Promise<PCR[]> {
    const headerRecordTypeId = await this.getRecordTypeId(this.salesforceObjectName, this.recordType);
    const data = await super.where(`Acc_Project_Participant__r.Acc_ProjectId__c='${projectId}'`);
    const mapper = new SalesforcePCRMapper(headerRecordTypeId);
    return mapper.map(data);
  }

  async getById(projectId: string, id: string): Promise<PCR> {
    const data = await super.where(`Acc_Project_Participant__r.Acc_ProjectId__c='${projectId}' AND (Id = '${id}' OR Acc_RequestHeader__c = '${id}')`);

    const headerRecordTypeId = await this.getRecordTypeId(this.salesforceObjectName, this.recordType);

    const mapper = new SalesforcePCRMapper(headerRecordTypeId);
    const mapped = mapper.map(data).pop();
    if (!mapped) {
      throw new NotFoundError();
    }
    return mapped;
  }

  async isExisting(projectId: string, projectChangeRequestId: string): Promise<boolean> {
    const data = await super.filterOne(`Acc_Project_Participant__r.Acc_ProjectId__c='${projectId}' AND Id = '${projectChangeRequestId}'`);

    return !!data;
  }

  async updateProjectChangeRequest(pcr: PCR) {
    await super.updateItem({
      Id: pcr.id,
      Acc_Comments__c: pcr.comments,
      Acc_MarkedasComplete__c: this.mapItemStatus(pcr.reasoningStatus),
      Acc_Reasoning__c: pcr.reasoning,
      Acc_Status__c: this.mapStatus(pcr.status),
    });
  }

  async updateItems(pcr: PCR, items: PCRItem[]) {
    await super.updateAll(items.map(x => ({
      Id: x.id,
      Acc_MarkedasComplete__c: this.mapItemStatus(x.status),
    })));
  }

  async createProjectChangeRequest(projectChangeRequest: ProjectChangeRequestForCreate) {
    const headerRecordTypeId = await this.getRecordTypeId(this.salesforceObjectName, this.recordType);
    // Insert header
    const id = await super.insertItem({
      RecordTypeId: headerRecordTypeId,
      Acc_MarkedasComplete__c: this.mapItemStatus(projectChangeRequest.reasoningStatus),
      Acc_Status__c: this.mapStatus(projectChangeRequest.status),
      Acc_Project_Participant__c: projectChangeRequest.projectId,
    });
    // Insert sub-items
    await this.insertItems(id, projectChangeRequest.items);
    return id;
  }

  async insertItems(headerId: string, items: ProjectChangeRequestItemForCreate[]) {
    await super.insertAll(items.map(x => ({
      Acc_RequestHeader__c: headerId,
      RecordTypeId: x.recordTypeId,
      Acc_MarkedasComplete__c: this.mapItemStatus(x.status),
      Acc_Project_Participant__c: x.projectId,
    })));
  }

  async delete(item: PCR) {
    return super.deleteAll([item.id, ... item.items.map(x => x.id)]);
  }

  private mapStatus(status: PCRStatus): string {
    switch (status) {
      case PCRStatus.Draft:
        return "Draft";
      case PCRStatus.SubmittedToMonitoringOfficer:
        return "Submitted to Monitoring Officer";
      case PCRStatus.QueriedByMonitoringOfficer:
        return "Queried by Monitoring Officer";
      case PCRStatus.SubmittedToInnovationLead:
        return "Submitted to Innovation Lead";
      case PCRStatus.QueriedByInnovateUK:
        return "Queried by Innovate UK";
      case PCRStatus.InExternalReview:
        return "In External Review";
      case PCRStatus.InReviewWithInnovateUK:
        return "In Review with Innovate UK";
      case PCRStatus.Rejected:
        return "Rejected";
      case PCRStatus.Withdrawn:
        return "Withdrawn";
      case PCRStatus.Approved:
        return "Approved";
      case PCRStatus.Actioned:
        return "Actioned";
      default:
        return "";
    }
  }

  private mapItemStatus(status?: PCRItemStatus): string {
    switch (status) {
      case PCRItemStatus.ToDo:
        return "To Do";
      case PCRItemStatus.Incomplete:
        return "Incomplete";
      case PCRItemStatus.Complete:
        return "Complete";
      default:
        return "";
    }
  }
}
