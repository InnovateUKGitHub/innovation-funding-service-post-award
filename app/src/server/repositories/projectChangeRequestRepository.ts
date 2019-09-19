import {
  ProjectChangeRequestEntity,
  ProjectChangeRequestForCreateEntity,
  ProjectChangeRequestItemEntity,
  ProjectChangeRequestItemForCreateEntity,
  ProjectChangeRequestItemStatus,
  ProjectChangeRequestStatus
} from "@framework/entities";
import SalesforceRepositoryBase from "./salesforceRepositoryBase";
import { Connection } from "jsforce";
import { ILogger } from "@server/features/common/logger";
import { SalesforcePCRMapper } from "./mappers/pcrSummaryMapper";
import { NotFoundError } from "@server/features/common";

export interface IProjectChangeRequestRepository {
  createProjectChangeRequest(projectChangeRequest: ProjectChangeRequestForCreateEntity): Promise<string>;
  updateProjectChangeRequest(pcr: ProjectChangeRequestEntity): Promise<void>;
  updateItems(pcr: ProjectChangeRequestEntity, items: ProjectChangeRequestItemEntity[]): Promise<void>;
  getAllByProjectId(projectId: string): Promise<ProjectChangeRequestEntity[]>;
  getById(projectId: string, id: string): Promise<ProjectChangeRequestEntity>;
  insertItems(headerId: string, items: ProjectChangeRequestItemForCreateEntity[]): Promise<void>;
  isExisting(projectId: string, projectChangeRequestId: string): Promise<boolean>;
  delete(pcr: ProjectChangeRequestEntity): Promise<void>;
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
  Acc_Project__c: string;
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
    "Acc_Project_Participant__c",
    "Acc_Project__c",
    "Acc_Reasoning__c",
    "Acc_MarkedAsComplete__c",
    "toLabel(Acc_MarkedAsComplete__c) MarkedAsCompleteName",
    "Acc_Comments__c",
  ];

  async getAllByProjectId(projectId: string): Promise<ProjectChangeRequestEntity[]> {
    const headerRecordTypeId = await this.getRecordTypeId(this.salesforceObjectName, this.recordType);
    const data = await super.where(`Acc_Project_Participant__r.Acc_ProjectId__c='${projectId}'`);
    const mapper = new SalesforcePCRMapper(headerRecordTypeId);
    return mapper.map(data);
  }

  async getById(projectId: string, id: string): Promise<ProjectChangeRequestEntity> {
    const data = await super.where(`Acc_Project__c='${projectId}' AND (Id = '${id}' OR Acc_RequestHeader__c = '${id}')`);

    const headerRecordTypeId = await this.getRecordTypeId(this.salesforceObjectName, this.recordType);

    const mapper = new SalesforcePCRMapper(headerRecordTypeId);
    const mapped = mapper.map(data).pop();
    if (!mapped) {
      throw new NotFoundError();
    }
    return mapped;
  }

  async isExisting(projectId: string, projectChangeRequestId: string): Promise<boolean> {
    const data = await super.filterOne(`Acc_Project__c='${projectId}' AND Id = '${projectChangeRequestId}'`);

    return !!data;
  }

  async updateProjectChangeRequest(pcr: ProjectChangeRequestEntity) {
    await super.updateItem({
      Id: pcr.id,
      Acc_Comments__c: pcr.comments,
      Acc_MarkedasComplete__c: this.mapItemStatus(pcr.reasoningStatus),
      Acc_Reasoning__c: pcr.reasoning,
      Acc_Status__c: this.mapStatus(pcr.status),
    });
  }

  async updateItems(pcr: ProjectChangeRequestEntity, items: ProjectChangeRequestItemEntity[]) {
    await super.updateAll(items.map(x => ({
      Id: x.id,
      Acc_MarkedasComplete__c: this.mapItemStatus(x.status),
    })));
  }

  async createProjectChangeRequest(projectChangeRequest: ProjectChangeRequestForCreateEntity) {
    const headerRecordTypeId = await this.getRecordTypeId(this.salesforceObjectName, this.recordType);
    // Insert header
    const id = await super.insertItem({
      RecordTypeId: headerRecordTypeId,
      Acc_MarkedasComplete__c: this.mapItemStatus(projectChangeRequest.reasoningStatus),
      Acc_Status__c: this.mapStatus(projectChangeRequest.status),
      Acc_Project_Participant__c: projectChangeRequest.partnerId,
      Acc_Project__c: projectChangeRequest.projectId,
    });
    // Insert sub-items
    await this.insertItems(id, projectChangeRequest.items);
    return id;
  }

  async insertItems(headerId: string, items: ProjectChangeRequestItemForCreateEntity[]) {
    await super.insertAll(items.map(x => ({
      Acc_RequestHeader__c: headerId,
      RecordTypeId: x.recordTypeId,
      Acc_MarkedasComplete__c: this.mapItemStatus(x.status),
      Acc_Project_Participant__c: x.partnerId,
      Acc_Project__c: x.projectId,
    })));
  }

  async delete(item: ProjectChangeRequestEntity) {
    return super.deleteAll([item.id, ... item.items.map(x => x.id)]);
  }

  private mapStatus(status: ProjectChangeRequestStatus): string {
    switch (status) {
      case ProjectChangeRequestStatus.Draft:
        return "Draft";
      case ProjectChangeRequestStatus.SubmittedToMonitoringOfficer:
        return "Submitted to Monitoring Officer";
      case ProjectChangeRequestStatus.QueriedByMonitoringOfficer:
        return "Queried by Monitoring Officer";
      case ProjectChangeRequestStatus.SubmittedToInnovationLead:
        return "Submitted to Innovation Lead";
      case ProjectChangeRequestStatus.QueriedByInnovateUK:
        return "Queried by Innovate UK";
      case ProjectChangeRequestStatus.InExternalReview:
        return "In External Review";
      case ProjectChangeRequestStatus.InReviewWithInnovateUK:
        return "In Review with Innovate UK";
      case ProjectChangeRequestStatus.Rejected:
        return "Rejected";
      case ProjectChangeRequestStatus.Withdrawn:
        return "Withdrawn";
      case ProjectChangeRequestStatus.Approved:
        return "Approved";
      case ProjectChangeRequestStatus.Actioned:
        return "Actioned";
      default:
        return "";
    }
  }

  private mapItemStatus(status?: ProjectChangeRequestItemStatus): string {
    switch (status) {
      case ProjectChangeRequestItemStatus.ToDo:
        return "To Do";
      case ProjectChangeRequestItemStatus.Incomplete:
        return "Incomplete";
      case ProjectChangeRequestItemStatus.Complete:
        return "Complete";
      default:
        return "";
    }
  }
}
