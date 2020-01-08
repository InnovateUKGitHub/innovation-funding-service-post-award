import { Connection } from "jsforce";
import { DateTime } from "luxon";
import {
  ProjectChangeRequestEntity,
  ProjectChangeRequestForCreateEntity,
  ProjectChangeRequestItemEntity,
  ProjectChangeRequestItemForCreateEntity,
} from "@framework/entities";
import SalesforceRepositoryBase from "./salesforceRepositoryBase";
import { ILogger } from "@server/features/common/logger";
import { SalesforcePCRMapper } from "./mappers/projectChangeRequestMapper";
import { NotFoundError } from "@server/features/common";
import { PCRItemStatus, PCRStatus } from "@framework/constants";

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
  Acc_Reasoning__c: string;
  Acc_Project_Participant__c: string | null;
  Acc_Project__c: string;
  // careful there is a typo in the salesforce setup
  // will probably change to Acc_MarkedAsComplete__c in the future!!
  Acc_MarkedasComplete__c: string;
  Acc_NewOrganisationName__c: string|null;
  Acc_NewProjectSummary__c: string|null;
  Acc_NewPublicDescription__c: string|null;
  MarkedAsCompleteName: string;
  Acc_Comments__c: string;
  // careful there is a typo in the salesforce setup
  // will probably change to Acc_AdditionalNumberoFMonths__c in the future!!
  Acc_AdditionalNumberofMonths__c: number|null;
  Acc_NewProjectDuration__c: number|null;
  Acc_RemovalDate__c: string|null;
  Acc_RemovalPeriod__c: number|null;
  Acc_ExistingProjectDuration__c: number|null;
  Acc_SuspensionStarts__c: string|null;
  Acc_SuspensionEnds__c: string|null;
  Acc_PublicDescriptionSnapshot__c: string|null;
  Acc_ProjectSummarySnapshot__c: string|null;
  Acc_ExistingPartnerName__c: string|null;
  Acc_Nickname__c: string|null;
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
    "Acc_NewOrganisationName__c",
    "Acc_NewProjectSummary__c",
    "Acc_NewPublicDescription__c",
    "Acc_Reasoning__c",
    "Acc_MarkedAsComplete__c",
    "Acc_AdditionalNumberofMonths__c",
    "Acc_NewProjectDuration__c",
    "Acc_ExistingProjectDuration__c",
    "Acc_RemovalDate__c",
    "Acc_RemovalPeriod__c",
    "toLabel(Acc_MarkedAsComplete__c) MarkedAsCompleteName",
    "Acc_Comments__c",
    "Acc_SuspensionStarts__c",
    "Acc_SuspensionEnds__c",
    "Acc_PublicDescriptionSnapshot__c",
    "Acc_ProjectSummarySnapshot__c",
    "Acc_ExistingPartnerName__c",
    "Acc_Nickname__c",
  ];

  async getAllByProjectId(projectId: string): Promise<ProjectChangeRequestEntity[]> {
    const headerRecordTypeId = await this.getRecordTypeId(this.salesforceObjectName, this.recordType);
    const data = await super.where(`Acc_Project__c='${projectId}'`);
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

  // TODO maybe put in base class
  private toOptionalSFDate = (jsDate?: Date | null) => jsDate && DateTime.fromJSDate(jsDate).toFormat("yyyy-MM-dd");

  async updateItems(pcr: ProjectChangeRequestEntity, items: ProjectChangeRequestItemEntity[]) {
    await super.updateAll(items.map(x => ({
      Id: x.id,
      Acc_MarkedasComplete__c: this.mapItemStatus(x.status),
      Acc_NewProjectDuration__C: x.projectDuration,
      Acc_AdditionalNumberofMonths__c: x.additionalMonths,
      Acc_NewProjectSummary__c: x.projectSummary,
      Acc_NewPublicDescription__c: x.publicDescription,
      Acc_SuspensionStarts__c: this.toOptionalSFDate(x.suspensionStartDate),
      Acc_SuspensionEnds__c: this.toOptionalSFDate(x.suspensionEndDate),
      Acc_NewOrganisationName__c: x.accountName,
      Acc_RemovalDate__c: this.toOptionalSFDate(x.withdrawalDate),
      Acc_RemovalPeriod__c: x.removalPeriod,
      Acc_Project_Participant__c: x.partnerId
    })));
  }

  async createProjectChangeRequest(projectChangeRequest: ProjectChangeRequestForCreateEntity) {
    const headerRecordTypeId = await this.getRecordTypeId(this.salesforceObjectName, this.recordType);
    // Insert header
    const id = await super.insertItem({
      RecordTypeId: headerRecordTypeId,
      Acc_MarkedasComplete__c: this.mapItemStatus(projectChangeRequest.reasoningStatus),
      Acc_Status__c: this.mapStatus(projectChangeRequest.status),
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
      Acc_Project__c: x.projectId,
    })));
  }

  async delete(item: ProjectChangeRequestEntity) {
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
