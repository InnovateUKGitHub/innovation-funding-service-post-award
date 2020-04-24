import { Connection } from "jsforce";
import SalesforceRepositoryBase, {
  Insertable,
  SalesforceRepositoryBaseWithMapping,
  Updatable
} from "./salesforceRepositoryBase";
import { ILogger } from "@server/features/common/logger";
import { PcrSpendProfileEntity, PcrSpendProfileEntityForCreate } from "@framework/entities/pcrSpendProfile";
import { SalesforcePcrSpendProfileMapper } from "@server/repositories/mappers/pcrSpendProfileMapper";
import { ISalesforceFinancialVirement } from "@server/repositories/financialVirementRepository";

export interface ISalesforcePcrSpendProfile {
  Id: string;
  Acc_ProjectChangeRequest__c: string;
  Acc_CostCategoryID__c: string;
  RecordTypeId: string;

  // Labour fields
  Acc_CostOfRole__c?: number;
  Acc_GrossCostOfRole__c?: number;
  Acc_Role__c?: string;
  Acc_Rate__c?: number;
  // Coming back as a string but should be a number. Handled in the entity mapper.
  Acc_DaysSpentOnProject__c?: number;
}

export interface IPcrSpendProfileRepository {
  getAllForPcr(pcrItemId: string): Promise<PcrSpendProfileEntity[]>;
  insertSpendProfiles(items: PcrSpendProfileEntityForCreate[]): Promise<string[]>;
  updateSpendProfiles(items: PcrSpendProfileEntity[]): Promise<boolean>;
  deleteSpendProfiles(items: string[]): Promise<void>;
}

export class PcrSpendProfileRepository extends SalesforceRepositoryBase<ISalesforcePcrSpendProfile> implements IPcrSpendProfileRepository {
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
    "Acc_GrossCostOfRole__c",
    "Acc_Role__c",
    "Acc_Rate__c",
    "Acc_DaysSpentOnProject__c",
  ];

  private recordType = "PCR Spend Profile";

  public async getAllForPcr(pcrItemId: string): Promise<PcrSpendProfileEntity[]> {
    const pcrRecordTypeId = await this.getRecordTypeId(this.salesforceObjectName, this.recordType);
    const records = await super.where({
      Acc_ProjectChangeRequest__c: pcrItemId,
      RecordTypeId: pcrRecordTypeId
    });
    const mapper = new SalesforcePcrSpendProfileMapper(pcrRecordTypeId);
    return records.map(x => mapper.map(x));
  }

  public async insertSpendProfiles(items: PcrSpendProfileEntityForCreate[]) {
    const pcrRecordTypeId = await this.getRecordTypeId(this.salesforceObjectName, this.recordType);
    const mapper = new SalesforcePcrSpendProfileMapper(pcrRecordTypeId);
    const insertables: Insertable<ISalesforcePcrSpendProfile>[] = items.map(x => mapper.mapToSalesforceForCreate(x));
    return super.insertAll(insertables);
  }

  public async updateSpendProfiles(items: PcrSpendProfileEntity[]) {
    const pcrRecordTypeId = await this.getRecordTypeId(this.salesforceObjectName, this.recordType);
    const mapper = new SalesforcePcrSpendProfileMapper(pcrRecordTypeId);
    const updatables: ISalesforcePcrSpendProfile[] = items.map(x => mapper.mapToSalesforce(x));
    return super.updateAll(updatables);
  }

  public async deleteSpendProfiles(ids: string[]) {
    return super.deleteAll(ids);
  }
}
