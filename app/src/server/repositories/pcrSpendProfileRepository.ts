import { Connection } from "jsforce";
import SalesforceRepositoryBase, {
  Insertable
} from "./salesforceRepositoryBase";
import { ILogger } from "@server/features/common/logger";
import { PcrSpendProfileEntity, PcrSpendProfileEntityForCreate } from "@framework/entities/pcrSpendProfile";
import { SalesforcePcrSpendProfileMapper } from "@server/repositories/mappers/pcrSpendProfileMapper";
import { IPicklistEntry } from "@framework/types";

export interface ISalesforcePcrSpendProfile {
  Id: string;
  Acc_ProjectChangeRequest__c: string;
  Acc_CostCategoryID__c: string;
  RecordTypeId: string;

  // Description and total cost apply to all cost categories
  Acc_TotalCost__c: number | null;
  Acc_ItemDescription__c: string | null;

  // Other Funding fields
  Acc_DateSecured__c?: string;

  // Labour fields
  Acc_GrossCostOfRole__c?: number;
  Acc_Rate__c?: number;
  // Coming back as a string but should be a number. Handled in the entity mapper.
  Acc_DaysSpentOnProject__c?: number;

  // Overheads
  Acc_OverheadRate__c?: string;

  // Materials
  // Coming back as a string but should be a number. Handled in the entity mapper.
  Acc_Quantity__c?: number;
  Acc_CostPerItem__c?: number;

  // Subcontracting
  Acc_Country__c?: string;
  Acc_RoleAndDescription__c?: string;

  // Capital Usage
  Acc_NewOrExisting__c: string|null;
  NewOrExistingLabel?: string;
  // Coming back as a string but should be a number. Handled in the entity mapper.
  Acc_DepreciationPeriod__c?: number;
  Acc_NetPresentValue__c?: number;
  Acc_ResidualValue__c?: number;
  Acc_Utilisation__c?: number;

  // Travel and Subsistence
  // Coming back as a string but should be a number. Handled in the entity mapper.
  Acc_NumberOfTimes__c?: number;
  Acc_CostEach__c?: number;
}

export interface IPcrSpendProfileRepository {
  getAllForPcr(pcrItemId: string): Promise<PcrSpendProfileEntity[]>;
  insertSpendProfiles(items: PcrSpendProfileEntityForCreate[]): Promise<string[]>;
  updateSpendProfiles(items: PcrSpendProfileEntity[]): Promise<boolean>;
  deleteSpendProfiles(items: string[]): Promise<void>;
  getCapitalUsageTypes(): Promise<IPicklistEntry[]>;
  getOverheadRateOptions(): Promise<IPicklistEntry[]>;
}

export class PcrSpendProfileRepository extends SalesforceRepositoryBase<ISalesforcePcrSpendProfile> implements IPcrSpendProfileRepository {
  constructor(private readonly getRecordTypeId: (objectName: string, recordType: string) => Promise<string>, getSalesforceConnection: () => Promise<Connection>, logger: ILogger) {
    super(getSalesforceConnection, logger);
  }

  protected readonly salesforceObjectName = "Acc_IFSSpendProfile__c";
  protected salesforceFieldNames = [
    "Id",
    "Acc_ProjectChangeRequest__c",
    "Acc_CostCategoryID__c",
    "RecordTypeId",
    "Acc_TotalCost__c",
    "Acc_ItemDescription__c",
    // Other funding
    "Acc_DateSecured__c",
    // Labour
    "Acc_GrossCostOfRole__c",
    "Acc_Rate__c",
    "Acc_DaysSpentOnProject__c",
    // Overheads
    "Acc_OverheadRate__c",
    // Materials
    "Acc_Quantity__c",
    "Acc_CostPerItem__c",
    // Subcontracting
    "Acc_Country__c",
    "Acc_RoleAndDescription__c",
    // Capital Usage
    "Acc_NewOrExisting__c",
    "toLabel(Acc_NewOrExisting__c) NewOrExistingLabel",
    "Acc_DepreciationPeriod__c",
    "Acc_NetPresentValue__c",
    "Acc_ResidualValue__c",
    "Acc_Utilisation__c",
    // Travel and Subsistence
    "Acc_NumberOfTimes__c",
    "Acc_CostEach__c",
  ];

  private readonly recordType = "PCR Spend Profile";

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

  getCapitalUsageTypes(): Promise<IPicklistEntry[]> {
    return super.getPicklist("Acc_NewOrExisting__c");
  }

  getOverheadRateOptions(): Promise<IPicklistEntry[]> {
    return super.getPicklist("Acc_OverheadRate__c");
  }
}
