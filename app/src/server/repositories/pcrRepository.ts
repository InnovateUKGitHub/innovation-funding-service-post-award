import { PCR } from "@framework/entities/pcr";
import SalesforceRepositoryBase from "./salesforceRepositoryBase";
import { Connection } from "jsforce";
import { ILogger } from "@server/features/common/logger";
import { SalesforcePCRMapper } from "./mappers/pcrSummaryMapper";
import { NotFoundError } from "@server/features/common";

export interface IPCRRepository {
  getAllByProjectId(projectId: string): Promise<PCR[]>;
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

export class PCRRepository extends SalesforceRepositoryBase<ISalesforcePCR> implements IPCRRepository {
  constructor(private getRecordTypeId: (objectName: string, recordType: string) => Promise<string>, getSalesforceConnection: () => Promise<Connection>, logger: ILogger) {
    super(getSalesforceConnection, logger);
  }

  protected salesforceObjectName = "Acc_ProjectChangeRequest__c";

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
    const headerRecordTypeId = await this.getRecordTypeId(this.salesforceObjectName, "Request Header");
    const data = await super.where(`Acc_Project_Participant__r.Acc_ProjectId__c='${projectId}'`);
    const mapper = new SalesforcePCRMapper(headerRecordTypeId);
    return mapper.map(data);
  }

  async getById(projectId: string, id: string): Promise<PCR> {
    const data = await super.where(`Acc_Project_Participant__r.Acc_ProjectId__c='${projectId}' AND (Id = '${id}' OR Acc_RequestHeader__c = '${id}')`);

    const headerRecordTypeId = await this.getRecordTypeId(this.salesforceObjectName, "Request Header");

    const mapper = new SalesforcePCRMapper(headerRecordTypeId);
    const mapped = mapper.map(data).pop();
    if (!mapped) {
      throw new NotFoundError();
    }
    return mapped;
  }
}
