import { Connection } from "jsforce";
import SalesforceRepositoryBase, { SalesforceRepositoryBaseWithMapping } from "./salesforceRepositoryBase";
import { ILogger } from "@server/features/common/logger";
import { PcrSpendProfileEntity } from "@framework/entities/pcrSpendProfile";
import { SalesforcePcrSpendProfileMapper } from "@server/repositories/mappers/pcrSpendProfileMapper";

export interface ISalesforcePcrSpendProfile {
  Id: string;
  Acc_ProjectChangeRequest__c: string;
  Acc_CostCategoryID__c: string;
  RecordTypeId: string;
  Acc_CostOfRole__c: number;
}

export interface IPcrSpendProfileRepository {
  getAllForPcr(pcrItemId: string): Promise<PcrSpendProfileEntity[]>;
}

export class PcrSpendProfileRepository extends SalesforceRepositoryBaseWithMapping<ISalesforcePcrSpendProfile, PcrSpendProfileEntity> implements IPcrSpendProfileRepository {
  constructor(private getRecordTypeId: (objectName: string, recordType: string) => Promise<string>, getSalesforceConnection: () => Promise<Connection>, logger: ILogger) {
    super(getSalesforceConnection, logger);
  }

  protected readonly salesforceObjectName = "Acc_IFSSpendProfile__c";
  protected salesforceFieldNames = [
    "Id",
    "Acc_ProjectChangeRequest__c",
    "Acc_CostCategoryID__c",
    "RecordTypeId",
    "Acc_CostOfRole__c",
  ];

  protected mapper = new SalesforcePcrSpendProfileMapper();

  public async getAllForPcr(pcrItemId: string): Promise<PcrSpendProfileEntity[]> {
    const pcrRecordType = await this.getRecordTypeId(this.salesforceObjectName, "PCR Spend Profile");
    return super.where({
      Acc_ProjectChangeRequest__c: pcrItemId,
      RecordTypeId: pcrRecordType
    });
  }
}
