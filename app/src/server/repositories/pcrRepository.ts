import { PCR, PCRItemStatus, PCRItemType, PCRStatus, PCRSummary } from "@framework/entities/pcr";
import { range } from "@shared/range";
import { DateTime } from "luxon";
import { SalesforceInvalidFilterError } from "./errors";
import { RepositoryBase } from "./salesforceRepositoryBase";
import { Connection } from "jsforce";
import { ILogger } from "@server/features/common/logger";
import { SalesforcePCRDetailedMapper, SalesforcePCRSummaryMapper } from "./mappers/pcrSummaryMapper";

export interface IPCRRepository {
  getAllByProjectId(projectId: string): Promise<PCRSummary[]>;
  getById(projectId: string, id: string): Promise<PCR>;
}

export interface ISalesforcePCRSummary {
  Id: string;
  Acc_RequestHeader__c: string;
  Acc_RequestNumber__c: number;
  Acc_Status__c: string;
  StatusName: string;
  CreatedDate: string;
  LastModifiedDate: string;
  RecordTypeId: string;
  Acc_Project_Participant__r: {
    Id: string;
    Acc_ProjectId__c: string;
  };
}

export interface ISalesforcePCR extends ISalesforcePCRSummary {
  Acc_Reasoning__c: string;
  // careful there is a typo in the salesforce setup
  // will probably change to Acc_MarkedAsComplete__c in the future!!
  Acc_MarkedasComplete__c: string;
  MarkedAsCompleteName: string;
  Acc_Comments__c: string;
}

export class PCRRepository extends RepositoryBase implements IPCRRepository {
  constructor(private getRecordTypeId: (objectName: string, recordType: string) => Promise<string>, getSalesforceConnection: () => Promise<Connection>, logger: ILogger) {
    super(getSalesforceConnection, logger);
  }

  private salesforceObjectName = "Acc_ProjectChangeRequest__c";

  private standardFields: string[]= [
    "Id",
    "Acc_RequestHeader__c",
    "Acc_RequestNumber__c",
    "Acc_Status__c",
    "toLabel(Acc_Status__c) StatusName",
    "CreatedDate",
    "LastModifiedDate",
    "RecordTypeId",
    "Acc_Project_Participant__r.Id",
    "Acc_Project_Participant__r.Acc_ProjectId__c"
  ];

  private itemFields = [
    "Acc_Reasoning__c",
    "Acc_MarkedAsComplete__c",
    "toLabel(Acc_MarkedAsComplete__c) MarkedAsCompleteName",
    "Acc_Comments__c",
    ...this.standardFields
  ];

  async getAllByProjectId(projectId: string): Promise<PCRSummary[]> {
    const conn = await this.getSalesforceConnection();

    const query = conn.sobject(this.salesforceObjectName)
      .select(this.standardFields)
      .where(`Acc_Project_Participant__r.Acc_ProjectId__c='${projectId}'`)
      ;

    const data = await this.executeArray<ISalesforcePCRSummary>(query);

    const headerRecordTypeId = await this.getRecordTypeId(this.salesforceObjectName, "Request Header");

    const mapper = new SalesforcePCRSummaryMapper(headerRecordTypeId);
    return mapper.map(data);
  }

  async getById(projectId: string, id: string): Promise<PCR> {
    const conn = await this.getSalesforceConnection();

    const query = conn.sobject(this.salesforceObjectName)
      .select(this.itemFields)
      .where(`Acc_Project_Participant__r.Acc_ProjectId__c='${projectId}' AND (Id = '${id}' OR Acc_RequestHeader__c = '${id}')`)
      ;

    const data = await this.executeArray<ISalesforcePCR>(query);

    const headerRecordTypeId = await this.getRecordTypeId(this.salesforceObjectName, "Request Header");

    const mapper = new SalesforcePCRDetailedMapper(headerRecordTypeId);
    return mapper.map(data);
  }
}
